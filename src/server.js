import app from "./app.js";
import { connectDB, env, logger } from "./config/index.js";
import { logError } from "./utils/index.js";

let server;

// Gloabl error handler
process.on("uncaughtException", (err) => {
  logError("Uncaught exception", err.message, err.stack);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logError("unhandled rejection", err.message, err.stack);
  if (server) {
    server.close();
    process.exit(1);
  } else {
    process.exit(1);
  }
});

// DB Connection
connectDB()
  .then(async () => {
    logger.info("DB connection establised");
    server = app.listen(env.PORT, () => {
      logger.info(`Server is running on port: ${env.PORT}`);
    });
  })
  .catch((error) => {
    logError("DB Connection failed", error.message, error.stack);
    process.exit(1);
  });

//   Shutdown Gracefully
process.on("SIGTERM", () => {
  logger.info("SIGTERM recieved. Shutting down gracefully");
  if (server) {
    server.close(() => {
      logger.info("Process terminated successfully");
      process.exit(0);
    });
  }
});
