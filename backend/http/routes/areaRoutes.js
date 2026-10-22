import express from "express";

import {
  createArea,
  deleteArea,
  getAreaById,
  getAreas,
  reorderAreas,
  updateArea,
} from "../controllers/areaController.js";

import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { requireAreaAccess } from "../middlewares/areaScopeMiddleware.js";
import { validate } from "../validators/validate.js";
import {
  createAreaSchema,
  updateAreaSchema,
  reorderAreasSchema,
} from "../validators/areaSchemas.js";

const router = express.Router();

router.post(
  "/",
  authorizeRoles("admin", "developer"),
  validate(createAreaSchema),
  createArea,
);

// Load selectable areas before an area has been selected.
// getAreas must enforce role-based area filtering itself.
router.get(
  "/",
  authorizeRoles("admin", "developer", "clerk", "supervisor"),
  getAreas,
);

router.patch(
  "/reorder",
  authorizeRoles("admin", "developer"),
  validate(reorderAreasSchema),
  reorderAreas,
);

router.get(
  "/:id",
  authorizeRoles("admin", "developer", "clerk", "supervisor"),
  requireAreaAccess,
  getAreaById,
);

router.patch(
  "/:id",
  authorizeRoles("admin", "developer"),
  validate(updateAreaSchema),
  updateArea,
);

router.delete("/:id", authorizeRoles("admin", "developer"), deleteArea);

export default router;
