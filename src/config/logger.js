import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, errors, printf, colorize, json } = winston.format;

// Custom format for console
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || (typeof message ==="object" ? JSON.stringify(message) : message)}`;
});

const fileTransport = new DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "DD-MM-YYYY",
  maxSize: "20m",
  maxFiles: "15d",
  zippedArchive: true,
});

const errorTransport = new DailyRotateFile({
  filename: "logs/error-%DATE%.log",
  level: "error",
  datePattern: "DD-MM-YYYY",
  maxSize: "20m",
  maxFiles: "30d",
});

const isDevEnv = process.env.NODE_ENV !== "production"


// Logger
export const logger = winston.createLogger({
  level: isDevEnv ? "debug" : "info",
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports:[fileTransport, errorTransport]
});


if(isDevEnv){
    logger.add(new winston.transports.Console({
        format:combine(colorize(), timestamp(), consoleFormat)
    }))
}