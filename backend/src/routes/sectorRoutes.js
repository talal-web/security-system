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

const router = express.Router();

// ======================================
// CREATE
// ======================================

router.post("/", authorizeRoles("admin", "developer", "clerk"), createSector);

// ======================================
// GET ALL
// ======================================

router.get("/", getSectors);

// ======================================
// REORDER
// ======================================

router.patch(
  "/reorder",
  authorizeRoles("admin", "developer", "clerk"),
  reorderSectors,
);

// ======================================
// GET SINGLE
// ======================================

router.get("/:id", getSectorById);

// ======================================
// UPDATE
// ======================================

router.patch(
  "/:id",
  authorizeRoles("admin", "developer", "clerk"),
  updateSector,
);

// ======================================
// DELETE
// ======================================

router.delete("/:id", authorizeRoles("admin", "developer"), deleteSector);

export default router;
