// http/validators/areaSchemas.js
//
// Request-shape validation for the area routes. This only checks that the
// request is well-formed. It does NOT check anything that requires
// database state (duplicate name, or whether an area can be deleted) -
// those remain business rules owned by AreaService.

import { z } from "zod";

export const createAreaSchema = z
  .object({
    name: z
      .string({ message: "Area name is required" })
      .trim()
      .min(1, "Area name is required"),
    description: z.string().optional(),
  })
  .loose();

export const updateAreaSchema = z
  .object({
    name: z.string().trim().min(1, "Area name cannot be empty").optional(),
    description: z.string().optional(),
  })
  .loose();

const reorderAreaItemSchema = z.object({
  _id: z.string(),
  sortOrder: z
    .int({ message: "Each sortOrder must be a non-negative integer." })
    .min(0, { message: "Each sortOrder must be a non-negative integer." }),
});

export const reorderAreasSchema = z
  .object({
    areas: z
      .array(reorderAreaItemSchema)
      .min(1, "Areas array is required.")
      .superRefine((areas, ctx) => {
        const ids = areas.map((item) => item._id);

        if (new Set(ids.map(String)).size !== ids.length) {
          ctx.addIssue({
            code: "custom",
            message: "Duplicate area IDs are not allowed.",
          });
        }
      }),
  })
  .loose();
