// http/validators/locationSchemas.js
//
// Request-shape validation for the location routes. This only checks that
// the request is well-formed. It does NOT check anything that requires
// database state (sector existence/area scope, duplicate location names,
// or sector-location sort-order membership) - those remain business rules
// owned by LocationService.

import { z } from "zod";

import { objectIdString } from "./common.js";

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

const requiredSectorId = (missingMessage) =>
  z
    .string({ message: missingMessage })
    .min(1, missingMessage)
    .regex(OBJECT_ID_PATTERN, "Invalid sector ID");

export const createLocationSchema = z
  .object({
    name: z.string().trim().min(1, "Location name is required"),
    address: z.string().optional(),
    sector: requiredSectorId("Sector is required"),
  })
  .loose();

export const updateLocationSchema = z
  .object({
    name: z.string().trim().min(1, "Location name is required").optional(),
    address: z.string().optional(),
    sector: objectIdString("Invalid sector ID").optional(),
    isActive: z.boolean({ message: "Invalid isActive value" }).optional(),
  })
  .loose();

const reorderItemSchema = z.object({
  _id: objectIdString("Invalid or duplicate location IDs."),
  sortOrder: z.int({ message: "Invalid or duplicate sort orders." }).min(0, {
    message: "Invalid or duplicate sort orders.",
  }),
});

export const reorderLocationsSchema = z
  .object({
    sector: requiredSectorId("Sector is required."),
    locations: z
      .array(reorderItemSchema)
      .min(1, "Locations array is required.")
      .superRefine((locations, ctx) => {
        const ids = locations.map((item) => item._id);
        const sortOrders = locations.map((item) => item.sortOrder);

        if (new Set(ids.map(String)).size !== ids.length) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid or duplicate location IDs.",
          });
        }

        if (new Set(sortOrders).size !== sortOrders.length) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid or duplicate sort orders.",
          });
        }
      }),
  })
  .loose();
