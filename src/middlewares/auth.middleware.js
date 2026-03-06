import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
import { ProjectMember } from "../models/projectmember.models.js";
import mongoose from "mongoose";
import { Project } from "../models/project.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token =
        req.cookies?.accessToken ||
        (authHeader ? authHeader.replace("Bearer ", "") : undefined);

    // console.log("JWT_SECRET:", process.env.ACCESS_TOKEN_SECRET);
    // console.log("TOKEN:", token);

    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decodedToken?._id || decodedToken?.id;
        const user = await User.findById(userId).select(
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
        );
        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }
        req.user = user;
        next();
    } catch (error) {
        if (error?.projectName === "TokenExpiredError") {
            throw new ApiError(401, "Access token expired");
        }
        throw new ApiError(401, "Invalid access token");
    }
});

export const validateProjectPermission = (roles = []) => {
    //changed whole function
    return asyncHandler(async (req, res, next) => {
        const { projectId } = req.params;

        if (!projectId) {
            throw new ApiError(400, "Project ID is missing");
        }

        const projectMember = await ProjectMember.findOne({
            project: projectId,
            user: req.user._id,
        });

        console.log({
            projectId,
            userId: req.user._id,
            projectMember: projectMember,
        });

        if (!projectMember) {
            throw new ApiError(403, "No project found for the user");
        }

        req.projectMember = projectMember;

        if (roles.length && !roles.includes(projectMember.role)) {
            throw new ApiError(
                403,
                "You do not have permission to perform this action",
            );
        }

        next();
    });
};
