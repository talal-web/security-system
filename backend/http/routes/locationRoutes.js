// http/routes/locationRoutes.js

import express from "express";

import {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
  reorderLocations,
} from "../controllers/locationController.js";

import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { requireAreaAccess } from "../middlewares/areaScopeMiddleware.js";
import { validate } from "../validators/validate.js";
import {
  createLocationSchema,
  updateLocationSchema,
  reorderLocationsSchema,
} from "../validators/locationSchemas.js";

const router = express.Router();

// ======================================
// CREATE LOCATION
// ======================================

router.post(
  "/",
  authorizeRoles("admin", "developer", "clerk"),
  requireAreaAccess,
  validate(createLocationSchema),
  createLocation,
);

// ======================================
// REORDER LOCATIONS
// ======================================

router.patch(
  "/reorder",
  authorizeRoles("admin", "developer", "clerk"),
  requireAreaAccess,
  validate(reorderLocationsSchema),
  reorderLocations,
);

// ======================================
// GET ALL LOCATIONS
// ======================================

router.get("/", requireAreaAccess, getLocations);

// ======================================
// GET SINGLE LOCATION
// ======================================

router.get("/:id", requireAreaAccess, getLocationById);

// ======================================
// UPDATE LOCATION
// ======================================

router.put(
  "/:id",
  authorizeRoles("admin", "developer", "clerk"),
  requireAreaAccess,
  validate(updateLocationSchema),
  updateLocation,
);

// ======================================
// DELETE LOCATION
// ======================================

router.delete(
  "/:id",
  authorizeRoles("admin", "developer"),
  requireAreaAccess,
  deleteLocation,
);

export default router;
