class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);

    this.statusCode = statusCode;
    this.name = "ApiError";

    if (details !== undefined) {
      this.details = details;
    }

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export default ApiError;
