import mongoose from "mongoose";
import { Project } from "../model/project.model.js";
import { Task } from "../model/task.model.js";
import { AppError, handleSendResponse, internalServerErrTxt, logError, unauthorizedAccessTxt } from "../utils/index.js";
import { valGetProjectDetailsReqBody, validateCreateProReqBody, validateUpdateProjectReqBody } from "../validate/index.js";
import { logger } from "../config/logger.js";

// handleGetAllProjects
export const handleGetAllProjects = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const {page=1, limit=20} = req.query

    const totalCounts = await Project.countDocuments({owner_id:userId})

    // Get all projects createby loggedin user
    const projects = await Project.find({
      owner_id: userId,
    }).lean()
    .select("-__v")
    .skip((page-1) * limit)
    .limit(limit)
    .sort({createdAt:-1});

    const data = {
      totalPages: Math.ceil(totalCounts/limit),
      currPage:page,
      totalCounts,
      projects
    }

    handleSendResponse(res, 200, true, "Project list", data);
  } catch (error) {
    logError(internalServerErrTxt, error.message, error.stack);
    next({ ...error, message: internalServerErrTxt });
  }
};

// handleCreateProject
export const handleCreateProject = async (req, res, next) => {
  try {
    const reqBody = validateCreateProReqBody(req, next);

    const project = new Project(reqBody);
    const newProject = await project.save();

    handleSendResponse(
      res,
      201,
      true,
      "Project created successfully",
      newProject,
    );
  } catch (error) {
    logError(internalServerErrTxt, error.message, error.stack);
    next({ ...error, message: internalServerErrTxt });
  }
};

// handleGetProjectWithId
export const handleGetProjectWithId = async (req, res, next) => {
  try {
    const projectId = valGetProjectDetailsReqBody(req,next)

    const project = await Project.findById(projectId).lean().select('-__v')

    // Get tasks of this project
    const tasks = await Task.find({project_id:projectId}).lean().select("-__v")

    const response = {
      ...project,
      tasks
    }

    handleSendResponse(res, 200, true, "Project", response);
  } catch (error) {
    logError(internalServerErrTxt, error.message, error.stack);
    next({ ...error, message: internalServerErrTxt });
  }
};

// handleUpdateProject
export const handleUpdateProject = async (req, res, next) => {
  try {

    const reqBody = validateUpdateProjectReqBody(req,next)
    const {id} = req.params
    const {userId} = req.user

    const project = await Project.findById(id).lean()
    if(!project) return next(new AppError("no project found",404))

    // Check - owner of this project should be loggedInUser
    if(!(userId.equals(project.owner_id))){
      return next(new AppError(unauthorizedAccessTxt, 401))
    }

    const updateProject = await Project.findByIdAndUpdate(id, reqBody, {returnDocument:"after"}).lean().select("-__v")

    handleSendResponse(res, 200, true, "Project updated successfully", updateProject);
  } catch (error) {
    logError(internalServerErrTxt, error.message, error.stack);
    next({ ...error, message: internalServerErrTxt });
  }
};

// handleDeleteProject
export const handleDeleteProject = async (req, res, next) => {
  try {
    const {id} = req.params
    if(!id) return next(new AppError("project id is required"))
    
    const {userId} = req.user

    const project = await Project.findById(id).lean()
    if(!project) return next(new AppError("no project found or project has been deleted",404))
    
    // Check - owner of this project should be loggedInUser
    if(!userId.equals(project.owner_id)){
      return next(new AppError(unauthorizedAccessTxt, 401))
    }
    const deleteTask = await Task.deleteMany({project_id:id})
    logger.info(`Task deleted successfully: ${deleteTask}`)
    
    const deletedProject = await Project.findByIdAndDelete(id).lean()
    logger.info(`Project deleted successfully: ${deletedProject}`)

    handleSendResponse(res, 200, true, "Project deleted successfully", deletedProject);

  } catch (error) {
    logError(internalServerErrTxt, error.message, error.stack);
    next({ ...error, message: internalServerErrTxt });
  }
};



// handleProjectStats
export const handleProjectStats = async (req, res, next) => {
  try {
    const {id} = req.params
    if(!id) return next(new AppError("project id is required"))
    
    const projectStats = await Task.aggregate([
      {
        $match:{
          project_id: new mongoose.Types.ObjectId(id)
        }
      },
      {
        $facet:{
          statusCount:[
            {
              $group:{
              _id:"$status",
              count: {$sum:1}
            }
          }
          ],
          assigneeCount:[
            {
              $group:{
              _id:"$assignee_id",
              count: {$sum:1}
            }
          }
          ]
        }
      }
    ])

    handleSendResponse(res, 200, true, "Project stats", projectStats);
  } catch (error) {
    logError(internalServerErrTxt, error.message, error.stack);
    next({ ...error, message: internalServerErrTxt });
  }
};