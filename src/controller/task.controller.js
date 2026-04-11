import { Task } from "../model/task.model.js";
import {
  handleSendResponse,
  internalServerErrTxt,
  logError,
} from "../utils/index.js";
import { validateGetTaskReqBody, validateTaskReqBody } from "../validate/index.js";

// handleGetTasks
export const handleGetTasks = async (req, res, next) => {
  try {
    const filter = validateGetTaskReqBody(req,next)
    const {page=1, limit=20} = req.query

    const totalTaskCount = await Task.countDocuments()
    const tasks = await Task.find(filter)
    .lean()
    .select("-__v")
    .skip((page - 1) * limit)
    .limit(limit)

    const response = {
        totalPages: Math.ceil(totalTaskCount / limit),
        currPage:page,
        tasks
    }

    handleSendResponse(res, 200, true, "Task list", response);
  } catch (error) {
    logError(internalServerErrTxt, error.message, error.stack);
    next({ ...error, message: internalServerErrTxt });
  }
};

// handleCreateTask
export const handleCreateTask = async (req, res, next) => {
  try {

    const reqBody = validateTaskReqBody(req, next)

    const newTask = new Task(reqBody)
    const task = await newTask.save()

    handleSendResponse(res, 201, true, "Task created successfully", task);
  } catch (error) {
    logError(internalServerErrTxt, error.message, error.stack);
    next({ ...error, message: internalServerErrTxt });
  }
};

// handleUpdateTask
export const handleUpdateTask = async (req, res, next) => {
  try {
    handleSendResponse(res, 200, true, "Task updated successfully", {});
  } catch (error) {
    logError(internalServerErrTxt, error.message, error.stack);
    next({ ...error, message: internalServerErrTxt });
  }
};

// handleDeleteTask
export const handleDeleteTask = async (req, res, next) => {
  try {
    handleSendResponse(res, 200, true, "Task deleted successfully", {});
  } catch (error) {
    logError(internalServerErrTxt, error.message, error.stack);
    next({ ...error, message: internalServerErrTxt });
  }
};



