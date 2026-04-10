import express from 'express'
import { connectDB, env } from './config/index.js'
import { authRouter, projectRouter } from './routes/index.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { allowedHeaders, allowedMethods } from './utils/constants.js';
import { AppError } from './utils/custom.js'
import { errorMiddleware } from './middleware/error.middleware.js'

const app = express()


// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: allowedMethods,
    allowedHeaders: allowedHeaders
}))

app.use("/auth", authRouter)
app.use("/projects", projectRouter)


let server;

// DB Connection
connectDB().then(async () => {
    console.log("DB Connection Established")
    server = app.listen(env.PORT, () => {
        console.log(`Server is running on port: ${env.PORT}`)
    })
}).catch((error) => {
    console.log(error?.message)
})

// handle no route
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

// global error handler
app.use(errorMiddleware)

// Shutdown
process.on("SIGTERM", () => {
    console.log("Shutting down...");

    if (server) {
        server.close(() => {
            console.log("Process terminated");
        });
    }
});