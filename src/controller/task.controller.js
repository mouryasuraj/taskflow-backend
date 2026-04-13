import { logger } from "../config/logger.js";
import { Project } from "../model/project.model.js";
import { Task } from "../model/task.model.js";
import {
  AppError,
  handleSendResponse,
  internalServerErrTxt,
  logError,
  unauthorizedAccessTxt,
} from "../utils/index.js";
import { validateDeleteTask, validateGetTaskReqBody, validateTaskReqBody, validateUpdateTaskReqBody } from "../validate/index.js";

// handleGetTasks
export const handleGetTasks = async (req, res, next) => {
  try {
    const filter = validateGetTaskReqBody(req,next)
    const {page=1, limit=20} = req.query

    const totalCounts = await Task.countDocuments({project_id:filter.project_id})
    const tasks = await Task.find(filter)
    .populate("assignee_id", "name")
    .lean()
    .select("-__v")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({updatedAt:-1});

    const response = {
        totalPages: Math.ceil(totalCounts / limit),
        currPage:page,
        totalCounts,
        tasks,
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
    
    const reqBody = validateUpdateTaskReqBody(req, next)
    const {id} = req.params
    const {userId} = req.user

    const project = await Project.findById(reqBody.project_id)
    if(!project){
        const msg = `no project found: ${id}`
        logError(msg, msg)
        return next(new AppError(`no project found`,404))
    }
    let updatedTask;
    if(userId.equals(project.owner_id)){
      updatedTask = await Task.findByIdAndUpdate(id, reqBody, {returnDocument:"after"}).lean().select("-__v").populate("assignee_id", "name _id")
    }else if(userId.equals(reqBody.assignee_id)){
      updatedTask = await Task.findByIdAndUpdate(id, {status:reqBody.status}, {returnDocument:"after"}).lean().select("-__v")
    }else{
      logError("Unauthorized action", "Unauthorized action")
      return next(new AppError("Unauthorized action",403))
    }
    // update task

    if(!updatedTask){
    logError(`no task found to update against id: ${id}`, `no task found to update against id: ${id}`);
      return next(new AppError("No task found", 404))
    }

    handleSendResponse(res, 200, true, "Task updated successfully", updatedTask);
  } catch (error) {
    logError(internalServerErrTxt, error.message, error.stack);
    next({ ...error, message: internalServerErrTxt });
  }
};

// handleDeleteTask
export const handleDeleteTask = async (req, res, next) => {
  try {

  const {id, project_id} = validateDeleteTask(req, next)
  const {userId} = req.user

  const project = await Project.findById(project_id)
  if(!project){
      const msg = `no project found: ${id}`
      logError(msg, msg)
      return next(new AppError(`no project found`,404))
  }
  if(!userId.equals(project.owner_id)){
      logError("Unauthorized action", "Unauthorized action")
      return next(new AppError("Unauthorized action",403))
  }


    const task = await Task.findByIdAndDelete(id)
    if(!task){
      const msg = `no task found to delete against id: ${id}`
      logError(msg, msg)
      return next(new AppError(`no task found to delete against id: ${id}`,400))
    }

    handleSendResponse(res, 200, true, "Task deleted successfully", {_id:task._id});
  } catch (error) {
    logError(internalServerErrTxt, error.message, error.stack);
    next({ ...error, message: internalServerErrTxt });
  }
};



