import crypto from 'crypto'
import { env, publicKey } from "../config/index.js"
import { logError, unauthorizedAccessTxt } from "../utils/index.js"
import { User } from "../model/index.js"
import { AppError } from "../utils/index.js"
import jwt from 'jsonwebtoken'

export const authMiddleware = async (req, res, next) => {
    
    try {

        const accessToken = req.cookies.accessToken
        if (!accessToken) next(new AppError(unauthorizedAccessTxt, 401))

        const decoded = jwt.verify(accessToken, publicKey, {
            algorithms: 'RS256',
            issuer: env.ISSUER,
            audience: env.AUDIENCE
        })
        if (!decoded) next(new AppError("User not found", 404))

        const { email } = decoded
        const user = await User.findOne({ email })
        if (!user) next(new AppError("User not found", 404))

        req.user = {
            userId: user._id,
            email: user.email,
        }
        next()

    } catch (error) {
        logError("Unauthorized acesss", error.message, error.stack)
        next(new AppError(unauthorizedAccessTxt, 401))
    }
}

