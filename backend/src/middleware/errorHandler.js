import logger from "../config/logger.js";

export const errorHandler = (err, req, res, next) => {
  // ======================================
  // Default status code (more reliable)
  // ======================================
  let statusCode = err.statusCode || res.statusCode;

  if (!statusCode || statusCode === 200) {
    statusCode = 500;
  }

  // ======================================
  // Normalize common Mongo/Mongoose errors
  // ======================================
  let message = err.message || "Internal Server Error";

  // Invalid ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Duplicate key error (MongoDB)
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered`;
  }

  // Validation error (Mongoose)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // ======================================
  // Structured log (Winston)
  // ======================================
  logger.error({
    message,
    stack: err.stack,

    method: req.method,
    url: req.originalUrl,

    ip: req.ip,
    userAgent: req.headers["user-agent"],

    statusCode,

    timestamp: new Date().toISOString(),
  });

  // ======================================
  // API response
  // ======================================
  res.status(statusCode).json({
    success: false,
    message,

    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
