import mongoose, { Schema } from 'mongoose';
import { allowedTaskPriority, allowedTaskStatus } from '../utils/index.js';

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
        enum: allowedTaskStatus,
        default: "todo"
    },
    priority: {
        type: String,
        enum: allowedTaskPriority,
        default: "low"
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

