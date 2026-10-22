// http/routes/sectorRoutes.js

import express from "express";

import {
  createSector,
  deleteSector,
  getSectorById,
  getSectors,
  reorderSectors,
  updateSector,
} from "../controllers/sectorController.js";

import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { requireAreaAccess } from "../middlewares/areaScopeMiddleware.js";
import { validate } from "../validators/validate.js";
import {
  createSectorSchema,
  updateSectorSchema,
  reorderSectorsSchema,
} from "../validators/sectorSchemas.js";

const router = express.Router();

// ======================================
// CREATE
// ======================================

router.post(
  "/",
  authorizeRoles("admin", "developer", "clerk"),
  requireAreaAccess,
  validate(createSectorSchema),
  createSector,
);

// ======================================
// GET ALL
// ======================================

router.get("/", requireAreaAccess, getSectors);

// ======================================
// REORDER
// ======================================

router.patch(
  "/reorder",
  authorizeRoles("admin", "developer", "clerk"),
  requireAreaAccess,
  validate(reorderSectorsSchema),
  reorderSectors,
);

// ======================================
// GET SINGLE
// ======================================

router.get("/:id", requireAreaAccess, getSectorById);

// ======================================
// UPDATE
// ======================================

router.patch(
  "/:id",
  authorizeRoles("admin", "developer", "clerk"),
  requireAreaAccess,
  validate(updateSectorSchema),
  updateSector,
);

// ======================================
// DELETE
// ======================================

router.delete(
  "/:id",
  authorizeRoles("admin", "developer"),
  requireAreaAccess,
  deleteSector,
);

export default router;
