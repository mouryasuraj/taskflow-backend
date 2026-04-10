import express from 'express'
import { handleLogin, handleLogout, handleVerifyToken, handleRegister } from '../controller/index.js';
import { authMiddleware } from '../middleware/index.js';

export const authRouter = express.Router()

authRouter.post("/login",handleLogin)
authRouter.post("/register", handleRegister)

authRouter.get("/logout", handleLogout)
authRouter.get("/verifytoken",authMiddleware,handleVerifyToken)
