import test from "node:test";
import assert from "node:assert/strict";

import logger from "../src/config/logger.js";
import { errorHandler } from "../src/middleware/errorHandler.js";

const runErrorHandler = (error) => {
  let statusCode;
  let body;
  const response = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(value) {
      body = value;
      return this;
    },
  };

  errorHandler(
    error,
    {
      method: "PUT",
      originalUrl: "/api/employees/employee-id",
      ip: "127.0.0.1",
      headers: {},
    },
    response,
    () => {},
  );

  return { statusCode, body };
};

test("error handler returns validation failures as 400", () => {
  const previousErrorLogger = logger.error;
  logger.error = () => {};

  try {
    const result = runErrorHandler({
      name: "ValidationError",
      message: "Validation failed",
      errors: {
        phone1: { message: "phone1 must be a valid phone number" },
      },
    });

    assert.equal(result.statusCode, 400);
    assert.equal(result.body.success, false);
    assert.match(result.body.message, /valid phone number/);
  } finally {
    logger.error = previousErrorLogger;
  }
});

test("error handler returns duplicate writes as 409 conflicts", () => {
  const previousErrorLogger = logger.error;
  logger.error = () => {};

  try {
    const result = runErrorHandler({ code: 11000, message: "duplicate key" });

    assert.equal(result.statusCode, 409);
    assert.equal(result.body.message, "A record with this value already exists");
  } finally {
    logger.error = previousErrorLogger;
  }
});

test("error handler hides unexpected server messages in production", () => {
  const previousErrorLogger = logger.error;
  const previousNodeEnvironment = process.env.NODE_ENV;
  logger.error = () => {};
  process.env.NODE_ENV = "production";

  try {
    const result = runErrorHandler(new Error("database connection details"));

    assert.equal(result.statusCode, 500);
    assert.equal(result.body.message, "Internal Server Error");
    assert.equal(result.body.stack, null);
  } finally {
    logger.error = previousErrorLogger;
    if (previousNodeEnvironment === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousNodeEnvironment;
    }
  }
});