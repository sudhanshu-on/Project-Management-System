import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Task } from "../models/tasks.models.js";
import { Subtask } from "../models/subtasks.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";
import mongoose, { mongo } from "mongoose";

const createSubtask = () =>
    asyncHandler(async (req, res) => {
        const { projectId, taskId } = req.params;
        const { subtaskName, subtaskDescription, assignedTo, status } =
            req.body;

        const task = await Task.findOne({
            _id: taskId,
            project: projectId,
        });

        if (!task) {
            throw new ApiError(404, "Task not found!");
        }

        const creatorMembership = await ProjectMember.findOne({
            user: new mongoose.Types.ObjectId(req.user._id),
            project: new mongoose.Types.ObjectId(projectId),
        });
        if (!creatorMembership) {
            throw new ApiError(403, "You are not a member of this project");
        }

        if (assignedTo && !Array.isArray(assignedTo)) {
            assignedTo = [assignedTo];
        }

        let assigneeIds = [];
        if (assignedTo && assignedTo.length) {
            // attempt to resolve each entry as either a projectMember _id or a user _id
            const objectIds = assignedTo.map(
                (id) => new mongoose.Types.ObjectId(id),
            );

            const members = await ProjectMember.find({
                $or: [
                    { _id: { $in: objectIds } },
                    { user: { $in: objectIds } },
                ],
                project: new mongoose.Types.ObjectId(projectId),
            });

            if (members.length !== assignedTo.length) {
                throw new ApiError(
                    400,
                    "One or more assignees are invalid or not part of the project",
                );
            }
            assigneeIds = members.map((m) => m._id);
        }

        const subtask = await Subtask.create({
            subtaskName: subtaskName,
            description: subtaskDescription,
            task: task._id,
            project: projectId,
            assignedTo: assigneeIds,
            assignedBy: creatorMembership._id,
            status: status,
        });

        return res
            .status(200)
            .json(
                new ApiResponse(200, subtask, "Subtask created successfully"),
            );
    });

const updateSubtask = () =>
    asyncHandler(async (req, res) => {
        const { subTaskId, projectId } = req.params;
        const { updatedSubtaskName, updatedSubtaskStatus } = req.body;

        const subtask = await Subtask.findOne({
            _id: subTaskId,
            project: projectId,
        });

        if (!subtask) {
            throw new ApiError(404, "Subtask not found!");
        }

        if (!updatedSubtaskName && !updatedSubtaskStatus) {
            throw new ApiError(400, "No fields provided to update");
        }

        if (updatedSubtaskName) subtask.subtaskName = updatedSubtaskName;
        if (updatedSubtaskStatus) subtask.status = updatedSubtaskStatus;

        await subtask.save();

        return res
            .status(200)
            .json(
                new ApiResponse(200, subtask, "Updated subtask successfully"),
            );
    });

const deleteSubtask = () =>
    asyncHandler(async (req, res) => {
        const { projectId, subTaskId } = req.params;

        const subtask = await Subtask.findOne({
            _id: subTaskId,
            project: projectId,
        });

        console.log(subtask);
        

        if (!subtask) {
            throw new ApiError(404, "Subtask not found!");
        }

        await Subtask.findOneAndDelete({
            _id: subTaskId,
        });

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Subtask deleted successfully"));
    });

export { createSubtask, updateSubtask, deleteSubtask };
