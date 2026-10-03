// routes/sector.routes.js

import express from "express";

import {
  createSector,
  deleteSector,
  getSectorById,
  getSectors,
  reorderSectors,
  updateSector,
} from "../controllers/sectorController.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { requireAreaAccess } from "../middleware/areaScopeMiddleware.js";

const router = express.Router();

// ======================================
// CREATE
// ======================================

router.post(
  "/",
  authorizeRoles("admin", "developer", "clerk"),
  requireAreaAccess,
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
