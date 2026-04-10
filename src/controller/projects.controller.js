import { Project } from "../model/project.model.js"
import { consoleError, handleSendResponse, internalServerErrTxt } from "../utils/index.js"
import { validateCreateProReqBody } from "../validate/index.js"


// handleGetAllProjects
export const handleGetAllProjects = async (req, res, next) => {
    try {

        const {userId} = req.user

        // Get all projects createby loggedin user
        const projects = await Project.find({owner_id:userId})
        
        handleSendResponse(res, 200, true, "Project list", projects)

    } catch (error) {
        consoleError(error)
        next(new AppError(internalServerErrTxt, 500))
    }
}

// handleCreateProject
export const handleCreateProject = async (req, res, next) => {
    try {

        const reqBody = validateCreateProReqBody(req)
        
        handleSendResponse(res, 201, true, "Project created successfully", reqBody)

    } catch (error) {
        consoleError(error)
        next(new AppError(internalServerErrTxt, 500))
    }
}


// handleGetProjectWithId
export const handleGetProjectWithId = async (req, res, next) => {
    try {



        handleSendResponse(res, 200, true, "Project", {})

    } catch (error) {
        consoleError(error)
        next(new AppError(internalServerErrTxt, 500))
    }
}


// handleUpdateProject
export const handleUpdateProject = async (req, res, next) => {
    try {



        handleSendResponse(res, 200, true, "Project updated successfully", {})

    } catch (error) {
        consoleError(error)
        next(new AppError(internalServerErrTxt, 500))
    }
}


// handleDeleteProject
export const handleDeleteProject = async (req, res, next) => {
    try {



        handleSendResponse(res, 200, true, "Project deleted successfully", {})

    } catch (error) {
        consoleError(error)
        next(new AppError(internalServerErrTxt, 500))
    }
}