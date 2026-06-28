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

const router = express.Router();

// CREATE LOCATION
router.post("/", createLocation);

router.patch("/reorder", reorderLocations);

// GET ALL LOCATIONS
router.get("/", getLocations);

// GET SINGLE LOCATION
router.get("/:id", getLocationById);

// UPDATE LOCATION
router.put("/:id", updateLocation);

// DELETE LOCATION
router.delete("/:id", deleteLocation);

export default router;
