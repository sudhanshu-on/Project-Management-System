import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Task } from "../models/tasks.models.js";
import { Subtask } from "../models/subtasks.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";
import mongoose from "mongoose";

const getTasks = () =>
    asyncHandler(async (req, res) => {
        const { projectId } = req.params;
        const tasks = await Task.find({
            project: new mongoose.Types.ObjectId(projectId),
        })
            .populate({
                path: "assignedTo",
                populate: {
                    path: "user",
                    select: "avatar username fullName",
                },
            })
            .sort({ createdAt: -1 });
        // .populate("assignedTo", "avatar username fullName");
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    tasks,
                    "Fetched all tasks of the project succesfully",
                ),
            );
    });

const createTask = () =>
    asyncHandler(async (req, res) => {
        let { taskName, description, status, assignedTo } = req.body;
        const { projectId } = req.params;

        // make sure the user creating the task is a member of the project
        const creatorMembership = await ProjectMember.findOne({
            user: new mongoose.Types.ObjectId(req.user._id),
            project: new mongoose.Types.ObjectId(projectId),
        });
        if (!creatorMembership) {
            throw new ApiError(403, "You are not a member of this project");
        }

        const files = req.files || [];

        files.map((file) => {
            return {
                url: `${process.env.SERVER_URL}/images/${file.originalname}`,
                mimetype: file.mimetype,
                size: file.size,
            };
        });

        // normalize assignedTo into an array; allow single value
        if (assignedTo && !Array.isArray(assignedTo)) {
            assignedTo = [assignedTo];
        }

        // validate assignees if provided
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

        const task = await Task.create({
            taskName: taskName,
            description: description,
            project: projectId,
            assignedBy: creatorMembership._id, // store project-member record
            assignedTo: assigneeIds,
            status: status,
        });

        return res
            .status(201)
            .json(new ApiResponse(200, task, "Task created successfully"));
    });

const getTaskDetail = () =>
    asyncHandler(async (req, res) => {
        const { projectId, taskId } = req.params;

        const project = await Project.findById(projectId);

        if (!project) {
            throw new ApiError(404, "Project not found");
        }

        const task = await Task.findById(taskId);

        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, task, "Task fetched successfully!"));
    });

const updateTask = () =>
    asyncHandler(async (req, res) => {
        const { projectId, taskId } = req.params;
        const { updatedTaskName, updatedDescription, updatedStatus } = req.body;

        const task = await Task.findOne({
            _id: taskId,
            project: projectId,
        });

        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        if (updatedTaskName) task.taskName = updatedTaskName;
        if (updatedDescription) task.description = updatedDescription;
        if (updatedStatus) task.status = updatedStatus;

        await task.save();

        return res
            .status(200)
            .json(new ApiResponse(200, task, "Task updated successfully!"));
    });

const deleteTask = () =>
    asyncHandler(async (req, res) => {
        const { taskId, projectId } = req.params;

        const task = await Task.findOne({
            _id: taskId,
            project: projectId,
        });

        if (!task) {
            throw new ApiError(404, "Task not found!");
        }

        await Task.findOneAndDelete({
            _id: taskId,
        });

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Task deleted successfully"));
    });

export {
    getTasks,
    getTaskDetail,
    createTask,
    updateTask,
    deleteTask,
};
