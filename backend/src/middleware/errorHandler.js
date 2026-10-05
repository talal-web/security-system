import logger from "../config/logger.js";

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || res.statusCode;

  if (
    !Number.isInteger(statusCode) ||
    statusCode < 400 ||
    statusCode > 599
  ) {
    statusCode = 500;
  }

  let message = err.message || "Internal Server Error";

  // Invalid ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Invalid multipart upload
  if (err.name === "MulterError") {
    statusCode = 400;
  }

  const isProduction = process.env.NODE_ENV === "production";
  const responseMessage =
    statusCode >= 500 && isProduction
      ? "Internal Server Error"
      : message;

  // Structured log
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

  // API response
  res.status(statusCode).json({
    success: false,
    message: responseMessage,

    ...(statusCode < 500 && err.details !== undefined && {
      details: err.details,
    }),

    stack: isProduction ? null : err.stack,
  });
};
