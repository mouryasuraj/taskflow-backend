import { Project } from "../model/project.model.js"
import { consoleError, handleError, handleSendResponse, somethingWentWrongTxt } from "../utils/index.js"
import { validateCreateProReqBody } from "../validate/index.js"


// handleGetAllProjects
export const handleGetAllProjects = async (req, res) => {
    try {

        const {userId} = req.user

        // Get all projects createby loggedin user
        const projects = await Project.find({owner_id:userId})
        
        handleSendResponse(res, 200, true, "Project list", projects)

    } catch (error) {
        consoleError(error)
        const statusCode = error.statusCode || 500
        handleError(res, statusCode, error?.message || somethingWentWrongTxt)
    }
}

// handleCreateProject
export const handleCreateProject = async (req, res) => {
    try {

        const reqBody = validateCreateProReqBody(req)
        
        handleSendResponse(res, 201, true, "Project created successfully", reqBody)

    } catch (error) {
        consoleError(error)
        const statusCode = error.statusCode || 500
        handleError(res, statusCode, error?.message || somethingWentWrongTxt)
    }
}


// handleGetProjectWithId
export const handleGetProjectWithId = async (req, res) => {
    try {



        handleSendResponse(res, 200, true, "Project", {})

    } catch (error) {
        consoleError(error)
        const statusCode = error.statusCode || 500
        handleError(res, statusCode, error?.message || somethingWentWrongTxt)
    }
}


// handleUpdateProject
export const handleUpdateProject = async (req, res) => {
    try {



        handleSendResponse(res, 200, true, "Project updated successfully", {})

    } catch (error) {
        consoleError(error)
        const statusCode = error.statusCode || 500
        handleError(res, statusCode, error?.message || somethingWentWrongTxt)
    }
}


// handleDeleteProject
export const handleDeleteProject = async (req, res) => {
    try {



        handleSendResponse(res, 200, true, "Project deleted successfully", {})

    } catch (error) {
        consoleError(error)
        const statusCode = error.statusCode || 500
        handleError(res, statusCode, error?.message || somethingWentWrongTxt)
    }
}