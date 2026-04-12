import { AppError, isNotValid, isRequired, logError } from "../utils/index.js"
import { allowedSignUpFields, reqBodyNotPresentTxt, allowedLoginFields, unauthorizedAccessTxt } from "../utils/index.js"
import validator from 'validator'

export const validateLoginReqBody = (req,next) => {
    // Validate Reqbody
    if (!req?.body || Object.keys(req?.body || {}).length === 0) return next(new AppError(reqBodyNotPresentTxt, 400))

    const reqBody = req.body
    const reqBodyFields = Object.keys(reqBody)

    // Validate Reqbody fields
    const extraFields = reqBodyFields.filter((d) => !allowedLoginFields.includes(d));
    const isMissingFields = !allowedLoginFields.every(d => reqBodyFields.includes(d))

    // Validate Extrafields
    if (extraFields.length !== 0) {
        const message= `fields are not allowed: [${extraFields.join(", ")}]`
        logError("Validation failed", message, {})
        return next(new AppError(unauthorizedAccessTxt, 401))
    }
    // Validate Missing Fields
    if (isMissingFields) {
        const message= `Required fields are missing: [${allowedLoginFields.join(", ")}]`
        logError("Validation failed", message, {})
        return next(new AppError(unauthorizedAccessTxt, 401))
    }

    const { email, password } = reqBody
    const loginValidation = [
        {field:"email", isValid: !email, message: isRequired },
        {field:"email", isValid: email && !validator.isEmail(email), message: isNotValid },
        {field:"password", isValid: !password, message: isRequired },
    ]

    let err = {}

    for (const check of loginValidation) {
        if (check.isValid) {
            err[check.field] = check.message
        }
    }
    
    
    
    if(Object.keys(err).length>0){
        logError(unauthorizedAccessTxt, err.message, err.stack)
        return next(new AppError(unauthorizedAccessTxt, 401))
    }
    

    return { email: email.trim(), password: password.trim() }

}


export const validateRegisterReqBody = (req, next) => {
    if (!req?.body || Object.keys(req?.body || {}).length === 0) return next(new AppError(reqBodyNotPresentTxt, 400))

    const reqBody = req.body
    const reqBodyFields = Object.keys(reqBody)

    const extraFields = reqBodyFields.filter(f => !allowedSignUpFields.includes(f))
    if (extraFields.length > 0) {
        const errorMsg = `fields are not allowed: [${extraFields.join(", ")}]`
        return next(new AppError(errorMsg, 400))
    }

    const isMissingFields = !allowedSignUpFields.every(f => reqBodyFields.includes(f))
    if (isMissingFields) {
        const errorMsg = `Required fields are missing: ${allowedSignUpFields.join(", ")}`
        return next(new AppError(errorMsg, 400))
    }

    const { name, email, password } = reqBody;

    // Validate Req Body Fields
    const signupFieldValidation = [
        { field:"name", isValid: !name.trim(), message: isRequired },
        { field:"name", isValid: name && name.trim().length > 30, message: "should be less then 30 character" },
        { field:"email", isValid: !email.trim(), message: isRequired },
        { field:"email", isValid: email && !validator.isEmail(email.trim()), message: isNotValid },
        { field:"password", isValid: !password.trim(), message: isRequired },
        { field:"password", isValid: password &&  !validator.isStrongPassword(password.trim(), { minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 }), message: "is not strong" },
    ]

    let err={};

    for (const check of signupFieldValidation) {
        if (check.isValid) {
            err[check.field] = check.message
        }
    }
    if(Object.keys(err).length>0){
        return next(new AppError("validation failed", 400, err))
    }
    

    return reqBody
}


