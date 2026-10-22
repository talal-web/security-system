// http/validators/fineSchemas.js
//
// Request-shape validation for the fine routes. This only checks that the
// request is well-formed. It does NOT check anything that requires
// database state (employee existence/status, area-scope matching, or
// whether a fine has already been deducted) - those remain business rules
// owned by FineService.

import { z } from "zod";

import { objectIdString } from "./common.js";

export const createFineSchema = z
  .object({
    employee: objectIdString("Valid employee ID is required"),

    amount: z.coerce
      .number({ message: "Fine amount must be a valid whole number greater than 0" })
      .int("Fine amount must be a valid whole number greater than 0")
      .positive("Fine amount must be a valid whole number greater than 0"),

    fineDate: z.coerce.date({ message: "Invalid fine date" }).optional(),
    reason: z.string().trim().min(1, "Fine reason is required"),
  })
  // Sent by the frontend alongside the selected area; FineService validates
  // it against the area scope via areaScope, not this field.
  .loose();

export const updateFineSchema = z
  .object({
    amount: z.coerce
      .number({ message: "Fine amount must be a valid whole number greater than 0" })
      .int("Fine amount must be a valid whole number greater than 0")
      .positive("Fine amount must be a valid whole number greater than 0")
      .optional(),

    fineDate: z.coerce.date({ message: "Invalid fine date" }).optional(),
    reason: z.string().trim().min(1, "Fine reason is required").optional(),
  })
  // The frontend also sends `area` on update requests, even though
  // FineService intentionally never reads it from the body; let it pass
  // through.
  .loose();
