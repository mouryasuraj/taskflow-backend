import { logger } from "../config/index.js";

export const errorMiddleware = (err, req, res,next) => {

    const statusCode = err.statusCode || 500;

    let response = {
        error: process.env.NODE_ENV==="production" ? "internal server error" : err.message
    };
    if (err.fields) {
        response.fields = err.fields;
    }

    res.status(statusCode).json(response);
}
