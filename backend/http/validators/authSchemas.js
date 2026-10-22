// http/validators/authSchemas.js
//
// Request-shape validation for the auth routes. This only checks that the
// request is well-formed. It does NOT check credentials, account status,
// or anything else requiring database state - those remain business rules
// owned by AuthService.

import { z } from "zod";

const REQUIRED_MESSAGE = "User ID and password are required";

export const loginSchema = z
  .object({
    userId: z
      .string({ message: REQUIRED_MESSAGE })
      .trim()
      .min(1, REQUIRED_MESSAGE),
    password: z
      .string({ message: REQUIRED_MESSAGE })
      .min(1, REQUIRED_MESSAGE),
  })
  .loose();
