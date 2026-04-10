export const errorMiddleware = (err, req, res, next) => {
    console.error(err); 

    const statusCode = err.statusCode || 500;

    let response = {
        error: err.message || "internal server error",
    };
    if (err.fields) {
        response.fields = err.fields;
    }

    res.status(statusCode).json(response);
}
