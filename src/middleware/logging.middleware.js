import { logger } from "../config/index.js"

export const loggingMiddleware = (req,res, next) =>{
    const start = Date.now()
    res.on("finish",()=>{
        const duration = Date.now() - start

        logger.info({
            method:req.method,
            url:req.originalUrl,
            status:res.statusCode,
            duration:`${duration}ms`,
            ip:req.ip
        })
    })
    next()
}