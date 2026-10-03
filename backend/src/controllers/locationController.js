import {
  createLocationService,
  getLocationsService,
  getLocationByIdService,
  updateLocationService,
  deleteLocationService,
  reorderLocationsService,
} from "../services/location/location.service.js";

// ======================================
// CREATE
// ======================================

export const createLocation = async (req, res, next) => {
  try {
    const location = await createLocationService(req.body, req.areaScope);

    return res.status(201).json({
      success: true,
      message: "Location created successfully",
      data: location,
    });
  } catch (error) {
    error.operationMessage = "Failed to create location";
    return next(error);
  }
};

// ======================================
// GET ALL
// ======================================

export const getLocations = async (req, res, next) => {
  try {
    const locations = await getLocationsService(req.query, req.areaScope);

    return res.status(200).json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    error.operationMessage = "Failed to get locations";
    return next(error);
  }
};

// ======================================
// GET ONE
// ======================================

export const getLocationById = async (req, res, next) => {
  try {
    const location = await getLocationByIdService(req.params.id, req.areaScope);

    return res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    error.operationMessage = "Failed to get location";
    return next(error);
  }
};

// ======================================
// UPDATE
// ======================================

export const updateLocation = async (req, res, next) => {
  try {
    const location = await updateLocationService(
      req.params.id,
      req.body,
      req.areaScope,
    );

    return res.status(200).json({
      success: true,
      message: "Location updated successfully",
      data: location,
    });
  } catch (error) {
    error.operationMessage = "Failed to update location";
    return next(error);
  }
};

// ======================================
// DELETE
// ======================================

export const deleteLocation = async (req, res, next) => {
  try {
    await deleteLocationService(req.params.id, req.areaScope);

    return res.status(200).json({
      success: true,
      message: "Location deleted successfully",
    });
  } catch (error) {
    error.operationMessage = "Failed to delete location";
    return next(error);
  }
};

// ======================================
// REORDER
// ======================================

export const reorderLocations = async (req, res, next) => {
  try {
    await reorderLocationsService(req.body, req.areaScope);

    return res.status(200).json({
      success: true,
      message: "Locations reordered successfully.",
    });
  } catch (error) {
    error.operationMessage = "Failed to reorder locations";
    return next(error);
  }
};
