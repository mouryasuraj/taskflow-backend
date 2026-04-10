import express from "express";
import { authMiddleware } from "../middleware/index.js";
import { handleCreateProject, handleDeleteProject, handleGetAllProjects, handleGetProjectWithId, handleUpdateProject } from "../controller/index.js";


export const projectRouter = express.Router()

projectRouter.get("/",authMiddleware, handleGetAllProjects)
projectRouter.post("/",authMiddleware, handleCreateProject)
projectRouter.get("/:id",authMiddleware, handleGetProjectWithId)
projectRouter.patch("/:id",authMiddleware, handleUpdateProject)
projectRouter.delete("/:id",authMiddleware, handleDeleteProject)