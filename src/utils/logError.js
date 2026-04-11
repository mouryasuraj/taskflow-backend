import { logger } from "../config/index.js"

export const logError = (message, error, stack) =>{
    
    logger.error({
        message,
        error,
        stack
    })
}