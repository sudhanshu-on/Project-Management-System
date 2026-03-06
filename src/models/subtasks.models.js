import mongoose, { Schema } from "mongoose";
import { AvailableTaskStatus } from "../utils/constants.js";

const subtaskSchema = new Schema(
    {
        subtaskName: {
            type: String,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        task: {
            type: Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "ProjectMember",
        },
        assignedBy: {
            type: Schema.Types.ObjectId,
            ref: "ProjectMember",
            required: true,
        },
        status: {
            type: String,
            enum: AvailableTaskStatus,
            default: AvailableTaskStatus.TODO,
        },
    },
    { timestamps: true },
);

subtaskSchema.index({ task: 1 });

subtaskSchema.index({ task: 1, subtaskName: 1 }, { unique: true });

subtaskSchema.index({ assignedTo: 1 });

export const Subtask = mongoose.model("Subtask", subtaskSchema);
