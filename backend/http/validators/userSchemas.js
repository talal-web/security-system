// http/validators/userSchemas.js
//
// Request-shape validation for the user routes. This only checks that the
// request is well-formed. It does NOT check anything that requires
// database state or the acting user's permissions/role (self-update
// restrictions, whether a target user is a protected developer account,
// userId uniqueness) - those remain business rules owned by UserService.
//
// Note: role === "developer" is intentionally allowed through this schema
// on create - UserService rejects it itself with a 403 (not a 400), which
// a request-shape validator should not override.

import { z } from "zod";

const REQUIRED_FIELDS_MESSAGE =
  "userId, name, password and role are required";

const requiredText = (message) =>
  z.string({ message }).trim().min(1, message);

export const createUserSchema = z
  .object({
    userId: requiredText(REQUIRED_FIELDS_MESSAGE),
    name: requiredText(REQUIRED_FIELDS_MESSAGE),
    password: z
      .string({ message: REQUIRED_FIELDS_MESSAGE })
      .min(1, REQUIRED_FIELDS_MESSAGE),
    role: z.enum(["developer", "admin", "clerk", "supervisor"], {
      message: "Invalid user role",
    }),
    areas: z.array(z.any()).optional(),
    isActive: z.boolean({ message: "isActive must be a boolean" }).optional(),
  })
  .loose()
  .superRefine((data, ctx) => {
    // "developer" is rejected by the service with a 403, not here.
    if (data.role === "developer") return;

    if (
      (data.role === "clerk" || data.role === "supervisor") &&
      (!Array.isArray(data.areas) || data.areas.length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["areas"],
        message: "Clerks and supervisors must have at least one assigned area",
      });
    }

    if (data.role === "admin" && data.areas !== undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["areas"],
        message: "Admin and developer users do not require area assignments",
      });
    }
  });

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1, "Name cannot be empty").optional(),
    role: z.enum(["admin", "clerk", "supervisor"], {
      message: "Invalid user role",
    }).optional(),
    areas: z
      .array(z.any())
      .min(
        1,
        "At least one area assignment is required for clerks and supervisors",
      )
      .optional(),
    isActive: z.boolean({ message: "isActive must be a boolean" }).optional(),
  })
  .loose();

export const changeUserPasswordSchema = z
  .object({
    password: z
      .string({ message: "New password is required" })
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters"),
  })
  .loose();

export const updateUserStatusSchema = z
  .object({
    isActive: z.boolean({ message: "isActive must be a boolean" }),
  })
  .loose();
