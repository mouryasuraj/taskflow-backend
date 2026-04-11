import express from "express";
import { env } from "./config/index.js";
import { authRouter, projectRouter } from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { allowedHeaders, allowedMethods } from "./utils/index.js";
import { AppError } from "./utils/custom.js";
import { errorMiddleware, loggingMiddleware } from "./middleware/index.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: allowedMethods,
    allowedHeaders: allowedHeaders,
  }),
);

// Info logger
app.use(loggingMiddleware);

// Routes
app.use("/auth", authRouter);
app.use("/projects", projectRouter);


// handle no route
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

// global error handler
app.use(errorMiddleware);

export default app