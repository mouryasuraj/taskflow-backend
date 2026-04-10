import { allowedCreateProFields, AppError, consoleError, reqBodyNotPresentTxt, unauthorizedAccessTxt } from "../utils/index.js";

export const validateCreateProReqBody = (req) => {
    // Validate Reqbody
    if (!req?.body || Object.keys(req?.body || {}).length === 0) throw new AppError(reqBodyNotPresentTxt, 400)

    const reqBody = req.body
    const reqBodyFields = Object.keys(reqBody)

    // Validate Reqbody fields
    const extraFields = reqBodyFields.filter((d) => !allowedCreateProFields.includes(d));
    const isMissingFields = !allowedCreateProFields.every(d => reqBodyFields.includes(d))

    // Validate Extrafields
    if (extraFields.length !== 0) {
        const errMessage = `fields are not allowed: [${extraFields.join(", ")}]`
        consoleError({ message: errMessage })
        throw new AppError(errMessage, 400)
    }
    // Validate Missing Fields
    if (isMissingFields) {
        const errMessage = `Required fields are missing: [${allowedCreateProFields.join(", ")}]`
        consoleError({ message: errMessage })
        throw new AppError(errMessage, 400);
    }

    const { name} = reqBody
        if (!name) {
            consoleError({ message: "Please provide name" })
            throw new AppError("Please provide name", 400)
        }

    return reqBody
}