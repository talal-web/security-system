// http/validators/validate.js

import ApiError from "../../src/utils/ApiError.js";

// Validates req.body against a Zod schema before the request reaches the
// controller/service. Rejects malformed requests early, and replaces
// req.body with the parsed (and type-coerced) data on success.
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    return next(
      new ApiError(400, issues[0]?.message || "Invalid request body", issues),
    );
  }

  req.body = result.data;
  next();
};
