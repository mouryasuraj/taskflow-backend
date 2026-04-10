export class AppError extends Error{
    constructor(msg, statusCode, fields=null){
        super(msg)
        this.statusCode = statusCode
        this.fields = fields
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}