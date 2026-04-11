import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ["todo", "in_progress", "done"],
        default: this.status.enum[0]
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: this.status.enum[0]
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Project"
    },
    assignee_id: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    due_date: {
        type: Date,
        default: Date.now()
    }
},
    {
        timestamps: true
    }
)


export const Task = mongoose.model("Task", taskSchema)

