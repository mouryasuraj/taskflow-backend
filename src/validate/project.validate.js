import { allowedCreateProFields, AppError, consoleError, isRequired, reqBodyNotPresentTxt, unauthorizedAccessTxt } from "../utils/index.js";

export const validateCreateProReqBody = (req,next) => {
    // Validate Reqbody
    if (!req?.body || Object.keys(req?.body || {}).length === 0) return next(new AppError(reqBodyNotPresentTxt, 400))

    const reqBody = req.body
    const reqBodyFields = Object.keys(reqBody)

    // Validate Reqbody fields
    const extraFields = reqBodyFields.filter((d) => !allowedCreateProFields.includes(d));
    const isMissingFields = !allowedCreateProFields.every(d => reqBodyFields.includes(d))

    // Validate Extrafields
    if (extraFields.length !== 0) {
        const errMessage = `fields are not allowed: [${extraFields.join(", ")}]`
        consoleError({ message: errMessage })
        return next(new AppError(errMessage, 400))
    }
    // Validate Missing Fields
    if (isMissingFields) {
        const errMessage = `Required fields are missing: [${allowedCreateProFields.join(", ")}]`
        consoleError({ message: errMessage })
        return next(new AppError(errMessage, 400));
    }

    const { name} = reqBody
        if (!name) {
            return next(new AppError("validation failed", 400, {name:isRequired}))
        }

    return reqBody
}


export const valGetProjectDetailsReqBody = (req, next) =>{
    const {id} = req.params
    if(!id) return next(new AppError("project id is required", 400))
    return id
}