import {
  allowedTaskFields,
  allowedTaskPriority,
  allowedTaskStatus,
  allowedUpdateProFields,
  AppError,
  isNotValid,
  isRequired,
  reqBodyNotPresentTxt,
} from "../utils/index.js";

export const validateTaskReqBody = (req, next) => {
  if (!req?.body || Object.keys(req?.body || {}).length === 0)
    return next(new AppError(reqBodyNotPresentTxt, 400));

  const reqBody = req.body;
  const reqBodyFields = Object.keys(reqBody);

  const extraFields = reqBodyFields.filter(
    (f) => !allowedTaskFields.includes(f),
  );
  if (extraFields.length > 0) {
    const errorMsg = `fields are not allowed: [${extraFields.join(", ")}]`;
    return next(new AppError(errorMsg, 400));
  }

  const isMissingFields = !allowedTaskFields.every((f) =>
    reqBodyFields.includes(f),
  );
  if (isMissingFields) {
    const errorMsg = `Required fields are missing: ${allowedTaskFields.join(", ")}`;
    return next(new AppError(errorMsg, 400));
  }

  const { title, status, priority, project_id, assignee_id } = reqBody;

  // Validate Req Body Fields
  const taskFieldValidation = [
    { field: "title", isValid: !title.trim(), message: isRequired },
    { field: "status", isValid: !status.trim(), message: isRequired },
    {
      field: "status",
      isValid: status && !allowedTaskStatus.includes(status),
      message: isNotValid,
    },
    { field: "priority", isValid: !priority.trim(), message: isRequired },
    {
      field: "priority",
      isValid: priority && !allowedTaskPriority.includes(priority),
      message: isNotValid,
    },
    { field: "project_id", isValid: !project_id.trim(), message: isRequired },
    { field: "assignee_id", isValid: !assignee_id.trim(), message: isRequired },
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

export const validateGetTaskReqBody = (req, next) => {
  const project_id = req?.params?.id;
  const { status, assignee_id } = req.query;

  if (!project_id) return next(new AppError("project id required", 400));

  let filter = {};

  filter.project_id = project_id;

  if (status) filter.status = status;

  if (assignee_id) filter.assignee_id = assignee_id;

  return filter;
};

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

  const { name, owner_id } = reqBody;

  // Validate Req Body Fields
  const taskFieldValidation = [
    { field: "name", isValid: !name.trim(), message: isRequired },
    { field: "owner_id", isValid: !owner_id.trim(), message: isRequired },
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
