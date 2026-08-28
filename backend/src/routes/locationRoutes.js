// routes/location.routes.js

import express from "express";

import {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
  reorderLocations,
} from "../controllers/locationController.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ======================================
// CREATE LOCATION
// ======================================

router.post("/", authorizeRoles("admin", "developer", "clerk"), createLocation);

// ======================================
// REORDER LOCATIONS
// ======================================

router.patch(
  "/reorder",
  authorizeRoles("admin", "developer", "clerk"),
  reorderLocations,
);

// ======================================
// GET ALL LOCATIONS
// ======================================

router.get("/", getLocations);

// ======================================
// GET SINGLE LOCATION
// ======================================

router.get("/:id", getLocationById);

// ======================================
// UPDATE LOCATION
// ======================================

router.put(
  "/:id",
  authorizeRoles("admin", "developer", "clerk"),
  updateLocation,
);

// ======================================
// DELETE LOCATION
// ======================================

router.delete("/:id", authorizeRoles("admin", "developer"), deleteLocation);

export default router;
