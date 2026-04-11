import express from "express";
import { authMiddleware } from "../middleware/index.js";
import { handleCreateProject, handleCreateTask, handleDeleteProject, handleDeleteTask, handleGetAllProjects, handleGetProjectWithId, handleGetTasks, handleUpdateProject, handleUpdateTask } from "../controller/index.js";


export const projectRouter = express.Router()

projectRouter.get("/",authMiddleware, handleGetAllProjects)
projectRouter.post("/",authMiddleware, handleCreateProject)
projectRouter.get("/:id",authMiddleware, handleGetProjectWithId)
projectRouter.patch("/:id",authMiddleware, handleUpdateProject)
projectRouter.delete("/:id",authMiddleware, handleDeleteProject)

// Task
projectRouter.get("/:id/tasks",authMiddleware, handleGetTasks)
projectRouter.post("/:id/task",authMiddleware, handleCreateTask)
projectRouter.patch("/task/:id",authMiddleware, handleUpdateTask)
projectRouter.delete("/task/:id",authMiddleware, handleDeleteTask)
