// http/validators/advanceSchemas.js
//
// Request-shape validation for the advance routes. This only checks that
// the request is well-formed. It does NOT check anything that requires
// database state (employee existence, area-scope matching, or whether an
// advance has already been deducted) - those remain business rules owned
// by AdvanceService.

import { z } from "zod";

import { objectIdString, optionalObjectId } from "./common.js";

export const createAdvanceSchema = z
  .object({
    employee: objectIdString("Valid employee ID is required"),

    amount: z.coerce
      .number({ message: "Advance amount must be greater than 0" })
      .positive("Advance amount must be greater than 0"),

    advanceDate: z.coerce.date({ message: "Invalid advance date" }).optional(),
    description: z.string().optional(),

    // Sent by the frontend alongside the selected area; AdvanceService
    // checks it against the area scope itself.
    area: optionalObjectId("Invalid area ID"),
  })
  .loose();

export const updateAdvanceSchema = z
  .object({
    amount: z.coerce
      .number({ message: "Advance amount must be greater than 0" })
      .positive("Advance amount must be greater than 0")
      .optional(),

    advanceDate: z.coerce.date({ message: "Invalid advance date" }).optional(),
    description: z.string().optional(),
  })
  // The frontend also sends `area` on update requests, even though
  // AdvanceService doesn't read it from the body; let it pass through.
  .loose();
