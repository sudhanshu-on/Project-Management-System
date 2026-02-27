import mongoose,{Schema} from "mongoose";

const projectSchema = new Schema({
    projectName:{
        type: String,
        trim:true,
        required: true,
    },
    description:{
        type:String,
        trim:true,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        enum:["active","archived","deleted"],
        default: "active"
    }
},{timestamps:true})

projectSchema.index({projectName: 1, createdBy: 1}, {unique: true});

projectSchema.index({createdBy: 1});

export const Project = mongoose.model("Project",projectSchema);