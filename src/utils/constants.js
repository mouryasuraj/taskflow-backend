export const somethingWentWrongTxt = "Something went wrong. Please try again later."
export const emailAlreadyExistsTxt = "Email already exists."
export const userCreatedSuccessfullyTxt = "User Created Successfully"
export const reqBodyNotPresentTxt = "request body is not present"
export const maxAttemp = "Max Attempts reached. Account is blocked. Please contact your admin."

// User
export const allowedSignUpFields = ["name", "email", "password"]
export const allowedLoginFields = ["email", "password"]

// Projects
export const allowedCreateProFields = ["name","description","owner_id"]
export const allowedUpdateProFields = ["name","description","owner_id"]

// task 
export const allowedTaskFields = ["title","description","status","priority","project_id","assignee_id","due_date"]
export const allowedTaskStatus =  ["todo", "in_progress", "done"]
export const allowedTaskPriority =  ["low", "medium", "high"]

// API
export const allowedHeaders = ["Content-type", "Authorization"]
export const allowedMethods = ["GET", "POST", "PUT", "DELETE"]




// Error message
export const isRequired = "is required"
export const isNotValid = "is not valid"
export const unauthorizedAccessTxt = "unauthenticated"
export const internalServerErrTxt = "internal server error"