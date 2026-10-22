// http/validators/sectorSchemas.js
//
// Request-shape validation for the sector routes. This only checks that
// the request is well-formed. It does NOT check anything that requires
// database state (duplicate name/code, area-scope matching, or whether a
// sector can be deleted) - those remain business rules owned by
// SectorService.

import { z } from "zod";

import { objectIdString } from "./common.js";

export const createSectorSchema = z
  .object({
    name: z
      .string({ message: "Sector name is required" })
      .trim()
      .min(1, "Sector name is required"),
    code: z
      .string({ message: "Sector code is required" })
      .trim()
      .min(1, "Sector code is required"),
    description: z.string().optional(),
  })
  .loose();

export const updateSectorSchema = z
  .object({
    name: z.string().trim().min(1, "Sector name is required").optional(),
    code: z.string().trim().min(1, "Sector code is required").optional(),
    description: z.string({ message: "Invalid sector description" }).optional(),
    isActive: z.boolean({ message: "Invalid isActive value" }).optional(),
  })
  .loose();

const reorderSectorItemSchema = z.object({
  _id: objectIdString("Invalid or duplicate sector IDs."),
  sortOrder: z
    .int({ message: "Each sortOrder must be a unique non-negative integer." })
    .min(0, {
      message: "Each sortOrder must be a unique non-negative integer.",
    }),
});

export const reorderSectorsSchema = z
  .object({
    sectors: z
      .array(reorderSectorItemSchema)
      .min(1, "Sectors array is required.")
      .superRefine((sectors, ctx) => {
        const ids = sectors.map((item) => item._id);
        const sortOrders = sectors.map((item) => item.sortOrder);

        if (new Set(ids.map(String)).size !== ids.length) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid or duplicate sector IDs.",
          });
        }

        if (new Set(sortOrders).size !== sortOrders.length) {
          ctx.addIssue({
            code: "custom",
            message: "Each sortOrder must be a unique non-negative integer.",
          });
        }
      }),
  })
  .loose();
