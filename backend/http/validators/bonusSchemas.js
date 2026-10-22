// http/validators/bonusSchemas.js
//
// Request-shape validation for the bonus routes. This only checks that the
// request is well-formed. It does NOT check anything that requires
// database state (employee existence/status or area-scope matching) -
// those remain business rules owned by BonusService.

import { z } from "zod";

import { objectIdString, optionalObjectId } from "./common.js";

export const createBonusSchema = z
  .object({
    employeeId: objectIdString("Invalid employee ID"),

    amount: z.coerce
      .number({ message: "Bonus amount must be a positive integer" })
      .int("Bonus amount must be a positive integer")
      .positive("Bonus amount must be a positive integer"),

    bonusDate: z.coerce.date({ message: "Invalid bonus date" }).optional(),
    reason: z.string().trim().min(1, "Bonus reason is required"),

    // Sent by the frontend alongside the selected area; BonusService
    // checks it against the area scope itself.
    area: optionalObjectId("Invalid area ID"),
  })
  .loose();

export const updateBonusSchema = z
  .object({
    amount: z.coerce
      .number({ message: "Bonus amount must be a positive integer" })
      .int("Bonus amount must be a positive integer")
      .positive("Bonus amount must be a positive integer")
      .optional(),

    bonusDate: z.coerce.date({ message: "Invalid bonus date" }).optional(),
    reason: z.string().trim().min(1, "Bonus reason is required").optional(),
  })
  // The frontend also sends `area` on update requests, even though
  // BonusService never reads it from the body; let it pass through.
  .loose();
