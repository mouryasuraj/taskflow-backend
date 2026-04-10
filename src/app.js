import express from 'express'
import {connectDB, env} from './config/index.js'
import { authRouter, projectRouter } from './routes/index.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { allowedHeaders, allowedMethods } from './utils/constants.js';

const app = express()


// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:env.CLIENT_URL,
    credentials:true,
    methods: allowedMethods,
    allowedHeaders: allowedHeaders
}))

app.use("/auth", authRouter)
app.use("/projects", projectRouter)


// DB Connection
connectDB().then(async() => {
    console.log("DB Connection Established")
    app.listen(env.PORT, () => {
        console.log(`Server is running on port: ${env.PORT}`)
    })
}).catch((error) => {
    console.log(error?.message)
})
