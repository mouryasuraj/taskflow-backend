import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { validateRegisterReqBody, validateLoginReqBody } from "../validate/auth.validate.js"
import { AppError, consoleError, getStandardErrorMessage, handleError, handleSendResponse, emailAlreadyExistsTxt, unauthorizedAccessTxt } from "../utils/index.js"
import { User } from "../model/index.js"
import { env, privateKey } from '../config/index.js'

// handleLogin
export const handleLogin = async (req, res) => {
    try {

        const reqBody = validateLoginReqBody(req)

        const { email, password } = reqBody;

        // Check user existence
        const user = await User.findOne({ email })
        if (!user) throw new AppError("User not found", 401)
        
        if(user.status==="inactive") throw new AppError("User is inactive. Please contact your administrator.")

        // Verify password
        const isPassValid = await user.isPasswordValid(password)
        if (!isPassValid) throw new AppError("Invalid password", 401)

        const id = user?._id.toString()

        // Payload to put inside jwt token
        const payload = {
            user_id: id,
            email: user.email
        }

        // Access Token
        const accessToken = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '24h',
            issuer: env.ISSUER,
            audience: env.AUDIENCE,
        })

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: env.COOKIE_SECURE === "true",
            sameSite: "Strict",
            maxAge: 24* 60 * 60 * 1000  // 24h Expiry
        })

        const userData = {
            userId: id,
            email: user.email,
        }

        handleSendResponse(res, 200, true, "Logged in successfully", userData)
    } catch (error) {
        consoleError(error)
        const statusCode = error.statusCode || 500
        handleError(res, statusCode, error?.message || "Invalid Credentials")
    }
}

// handleRegister
export const handleRegister = async (req, res) => {
    try {
        const reqBody = validateRegisterReqBody(req)
        const { email, password } = reqBody;

        // Check user already exists or not
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return handleError(res, 409, emailAlreadyExistsTxt)
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, Number(env.SALT_ROUND))

        const payload = { ...reqBody, password: hashedPassword }

        const newUser = new User(payload)
        const savedUser = await newUser.save()

        const response = {
            id:savedUser._id,
            name:savedUser.name,
            email:savedUser.email,
            create_at:savedUser.createdAt,
        }

        handleSendResponse(res, 201, true, "User has been registered", response)

    } catch (error) {
        consoleError(error)  // Log error

        // Check Duplicacy
        if (error && error?.code === 11000) {
            return handleError(res, 409, emailAlreadyExistsTxt)
        }
        const statusCode = error?.statusCode || 500
        handleError(res, statusCode, getStandardErrorMessage(error))  // send error response
    }
}


// HandleLogout
export const handleLogout = async (req, res) => {
    try {
        res.clearCookie("accessToken")

        handleSendResponse(res, 200, true, "Logged out successfully")

    } catch (error) {
        consoleError(error)
        handleError(res, 500, "Logout failed")
    }
}


// handleVerifyToken
export const handleVerifyToken = async (req, res) => {
    try {
        const user = req.user
        handleSendResponse(res, 200, true, "Token verified successfully", user)
    } catch (error) {
        consoleError(error)
        handleError(res, 401, unauthorizedAccessTxt)
    }
}
