import mongoose,{Schema} from "mongoose";

const projectNoteSchema = new Schema({
    project:{
        type:Schema.Types.ObjectId,
        ref:"Project",
        required:true,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"ProjectMember",
        required:true,
    },
    content:{
        type:String,
        required:true,
        trim:true,
    }
},{timestamps:true})

projectNoteSchema.index({project:1})
projectNoteSchema.index({createdBy:1})

export const ProjectNote = mongoose.model("ProjectNote",projectNoteSchema);