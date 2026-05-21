// controllers/location.controller.js

import Location from "../models/Location.js";

/**
 * Create Location
 */
export const createLocation = async (req, res) => {
  try {
    const { name, address, sector } = req.body;

    const existing = await Location.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Location already exists",
      });
    }

    const location = await Location.create({
      name,
      address,
      sector,
    });

    return res.status(201).json({
      success: true,
      message: "Location created successfully",
      data: location,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Locations
 */
export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Single Location
 */
export const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Location
 */
export const updateLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Location updated",
      data: location,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Location
 */
export const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Location deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
