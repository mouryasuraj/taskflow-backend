import { allowedCreateProFields, allowedUpdateProFields, AppError, isRequired, logError, reqBodyNotPresentTxt, unauthorizedAccessTxt } from "../utils/index.js";

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
        const message = `fields are not allowed: [${extraFields.join(", ")}]`
        logError("Validation failed", message, {})
        return next(new AppError(message, 400))
    }
    // Validate Missing Fields
    if (isMissingFields) {
        const message = `Required fields are missing: [${allowedCreateProFields.join(", ")}]`
        logError("Validation failed", message, {})
        return next(new AppError(message, 400));
    }

    const { name} = reqBody
        if (!name) {
            return next(new AppError("validation failed", 400, {name:isRequired}))
        }

    return reqBody
}

export const validateUpdateProjectReqBody = (req, next) => {
  const {id} = req.params;
  if (!id) return next(new AppError("projectId is required"));

  if (!req?.body || Object.keys(req?.body || {}).length === 0) {
    return next(new AppError(reqBodyNotPresentTxt, 400));
  }

  const reqBody = req.body;
  const reqBodyFields = Object.keys(reqBody);

  const extraFields = reqBodyFields.filter(
    (f) => !allowedUpdateProFields.includes(f),
  );
  if (extraFields.length > 0) {
    const errorMsg = `fields are not allowed: [${extraFields.join(", ")}]`;
    return next(new AppError(errorMsg, 400));
  }

  const isMissingFields = !allowedUpdateProFields.every((f) =>
    reqBodyFields.includes(f),
  );
  if (isMissingFields) {
    const errorMsg = `Required fields are missing: ${allowedUpdateProFields.join(", ")}`;
    return next(new AppError(errorMsg, 400));
  }

  const { name } = reqBody;

  // Validate Req Body Fields
  const taskFieldValidation = [
    { field: "name", isValid: !name.trim(), message: isRequired },
  ];

  let err = {};

  for (const check of taskFieldValidation) {
    if (check.isValid) {
      err[check.field] = check.message;
    }
  }
  if (Object.keys(err).length > 0) {
    return next(new AppError("validation failed", 400, err));
  }

  return reqBody;
};

export const valGetProjectDetailsReqBody = (req, next) =>{
    const {id} = req.params
    if(!id) return next(new AppError("project id is required", 400))
    return id
}