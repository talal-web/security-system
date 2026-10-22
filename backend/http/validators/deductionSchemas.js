// http/validators/deductionSchemas.js
//
// Request-shape validation for the deduction routes. This only checks that
// the request is well-formed. It does NOT check anything that requires
// database state (employee existence/status, area-scope matching, or
// whether a deduction has already been processed) - those remain business
// rules owned by DeductionService.

import { z } from "zod";

import { objectIdString, optionalObjectId } from "./common.js";

export const createDeductionSchema = z
  .object({
    employee: objectIdString("Valid employee ID is required"),

    amount: z.coerce
      .number({
        message: "Deduction amount must be a valid whole number greater than 0",
      })
      .int("Deduction amount must be a valid whole number greater than 0")
      .positive(
        "Deduction amount must be a valid whole number greater than 0",
      ),

    deductionDate: z.coerce
      .date({ message: "Invalid deduction date" })
      .optional(),

    reason: z.string().trim().min(1, "Deduction reason is required"),

    // Sent by the frontend alongside the selected area; DeductionService
    // checks it against the area scope itself.
    area: optionalObjectId("Invalid area ID"),
  })
  .loose();

export const updateDeductionSchema = z
  .object({
    amount: z.coerce
      .number({
        message: "Deduction amount must be a valid whole number greater than 0",
      })
      .int("Deduction amount must be a valid whole number greater than 0")
      .positive(
        "Deduction amount must be a valid whole number greater than 0",
      )
      .optional(),

    deductionDate: z.coerce
      .date({ message: "Invalid deduction date" })
      .optional(),

    reason: z.string().trim().min(1, "Deduction reason is required").optional(),
  })
  // The frontend also sends `area` on update requests, even though
  // DeductionService never reads it from the body; let it pass through.
  .loose();
