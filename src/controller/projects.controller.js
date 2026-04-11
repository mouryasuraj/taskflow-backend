import { Project } from "../model/project.model.js";
import { Task } from "../model/task.model.js";
import { handleSendResponse, internalServerErrTxt, logError } from "../utils/index.js";
import { valGetProjectDetailsReqBody, validateCreateProReqBody } from "../validate/index.js";

// handleGetAllProjects
export const handleGetAllProjects = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const {page=1, limit=20} = req.query

    // Get all projects createby loggedin user
    const projects = await Project.find({
      owner_id: userId,
    }).lean()
    .select("-__v")
    .skip((page-1) * limit)
    .limit(limit)
    .sort({createdAt:-1});

    handleSendResponse(res, 200, true, "Project list", projects);
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
    handleSendResponse(res, 200, true, "Project updated successfully", {});
  } catch (error) {
    logError(internalServerErrTxt, error.message, error.stack);
    next({ ...error, message: internalServerErrTxt });
  }
};

// handleDeleteProject
export const handleDeleteProject = async (req, res, next) => {
  try {
    handleSendResponse(res, 200, true, "Project deleted successfully", {});
  } catch (error) {
    logError(internalServerErrTxt, error.message, error.stack);
    next({ ...error, message: internalServerErrTxt });
  }
};
