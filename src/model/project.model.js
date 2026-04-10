import mongoose, { Schema } from 'mongoose';

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default:""
    },
    owner_id: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
},
    {
        timestamps: true
    }
)


export const Project = mongoose.model("Project", projectSchema)

