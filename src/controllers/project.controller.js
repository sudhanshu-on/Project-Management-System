import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import mongoose from "mongoose";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

const getProjects = asyncHandler(async (req, res) => {
    const projects = await ProjectMember.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(req.user._id),
                status: "active",
            },
        },

        {
            $lookup: {
                from: "projects",
                localField: "project",
                foreignField: "_id",
                as: "project",
            },
        },

        { $unwind: "$project" },

        {
            $lookup: {
                from: "projectmembers",
                localField: "project._id",
                foreignField: "project",
                as: "members",
            },
        },

        {
            $addFields: {
                memberCount: { $size: "$members" },
            },
        },
        {
            $project: {
                _id: "$project._id",
                projectName: "$project.projectName",
                description: "$project.description",
                role: "$role",
                memberCount: 1,
                createdAt: "$project.createdAt",
            },
        },
    ]);

    if (projects.length === 0) {
        throw new ApiError(404, "No projects found for the user");
    }

    res.status(200).json(
        new ApiResponse(200, projects, "Fetched projects successfully"),
    );
});

const createProject = asyncHandler(async (req, res) => {
    const { projectName, description } = req.body;

    const existing = await Project.findOne({
        projectName,
        createdBy: req.user._id,
    });

    console.log("EXISTING PROJECT:", existing?._id);

    const project = await Project.create({
        projectName,
        description,
        createdBy: new mongoose.Types.ObjectId(req.user._id),
    });

    await ProjectMember.create({
        user: new mongoose.Types.ObjectId(req.user._id),
        project: new mongoose.Types.ObjectId(project._id),
        role: UserRolesEnum.ADMIN,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, project, "Project created successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId; //typecast error without projectId

    const project = await Project.findById(projectId);

    if (!project)
        throw new ApiError(404, "Project not found with the id given");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                project,
                "Project fetched from id successfully",
            ),
        );
});

const updateProjectById = asyncHandler(async (req, res) => {
    const { updatedProjectName, updatedProjectDescription } = req.body;
    const { projectId } = req.params;

    const project = await Project.findByIdAndUpdate(
        projectId,
        {
            projectName: updatedProjectName,
            description: updatedProjectDescription,
        },
        {
            new: true,
        },
    );

    if (!project) {
        throw new ApiError(404, "Project not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project Updated Successfully"));
});

const deleteProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
        throw new ApiError(404, "No project found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, project, "Deleted project successfully"));
});

const getProjectMembers = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    // Authorization should happen before this (middleware recommended)

    const projectMembers = await ProjectMember.aggregate([
        {
            $match: {
                project: new mongoose.Types.ObjectId(projectId),
                status: "active",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            fullName: 1,
                            userName: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                user: { $arrayElemAt: ["$user", 0] },
            },
        },
        {
            $project: {
                project: 1,
                user: 1,
                role: 1,
                createdAt: 1,
                updatedAt: 1,
                _id: 0,
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectMembers,
                "Fetched Project Members successfully",
            ),
        );
});

const addProjectMember = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { email, role } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw new ApiError(404, "User not found");

    await ProjectMember.findOneAndUpdate(
        {
            user: user._id,
            project: projectId,
        },
        {
            user: user._id,
            project: projectId,
            role: role,
        },
        {
            new: true,
            upsert: true,
        },
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Added the member to the project successfully",
            ),
        );
});

const updateProjectMemberRole = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;
    const { newRole } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "No project found");
    }
    if (!AvailableUserRoles.includes(newRole)) {
        throw new ApiError(404, "Invalid Role");
    }
    let projectMember = await ProjectMember.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(userId),
    });
    if (!projectMember) {
        throw new ApiError(404, "No project member found");
    }
    projectMember = await ProjectMember.findByIdAndUpdate(
        projectMember._id,
        {
            role: newRole,
        },
        {
            new: true,
        },
    );
    if (!projectMember) {
        throw new ApiError(404, "No project member found");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectMember,
                "Updated role of the project member successfully",
            ),
        );
});

const removeProjectMember = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;

    let projectMember = await ProjectMember.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(userId),
    });

    if (!projectMember) throw new ApiError(404, "No project member found");
    await ProjectMember.findOneAndDelete(projectMember._id);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Project Member removed successfully"));
});

export {
    createProject,
    getProjects,
    getProjectById,
    updateProjectById,
    deleteProjectById,
    getProjectMembers,
    addProjectMember,
    updateProjectMemberRole,
    removeProjectMember,
};
