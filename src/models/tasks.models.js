import mongoose, { Schema } from "mongoose";
import { AvailableTaskStatus } from "../utils/constants.js";

const taskSchema = new Schema(
    {
        taskName: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
        },

        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },

        assignedTo: [
            {
                type: Schema.Types.ObjectId,
                ref: "ProjectMember",
                required:true,
            },
        ],

        assignedBy: {
            type: Schema.Types.ObjectId,
            ref: "ProjectMember",
            required:true,
        },
        
        status: {
            type: String,
            enum: AvailableTaskStatus,
            default: AvailableTaskStatus.TODO,
        },

    },
    { timestamps: true },
);

taskSchema.index({ taskName: 1, project: 1 }, { unique: true });

taskSchema.index({ project: 1 });
taskSchema.index({ assignedTo: 1 });

export const Task = mongoose.model("Task", taskSchema);