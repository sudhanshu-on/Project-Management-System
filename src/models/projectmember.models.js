import mongoose, { Schema } from "mongoose";
import { UserRolesEnum, AvailableUserRoles } from "../utils/constants.js";

const projectMemberSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        project: {
            ref: "Project",
            required: true,
            type: Schema.Types.ObjectId,
        },
        role: {
            type: String,
            enum: AvailableUserRoles,
            default: UserRolesEnum.MEMBER,
        },
        status:{
            type:String,
            enum:["active", "invited", "removed"],
            default: "active"
        }
    },
    { timestamps: true },
);

projectMemberSchema.index({ project: 1, user: 1 }, {unique:true});
projectMemberSchema.index({ project: 1 }); //imporvement
projectMemberSchema.index({ user: 1 }); //improvement
// projectMemberSchema.index({ user: 1}, {unique:true}); debugged lol

export const ProjectMember = mongoose.model(
    "ProjectMember",
    projectMemberSchema,
);
