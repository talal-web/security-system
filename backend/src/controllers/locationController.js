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

export const createLocation = async (req, res) => {
  const location = await createLocationService(req.body, req.areaScope);

  return res.status(201).json({
    success: true,
    message: "Location created successfully",
    data: location,
  });
};

// ======================================
// GET ALL
// ======================================

export const getLocations = async (req, res) => {
  const locations = await getLocationsService(req.query, req.areaScope);

  return res.status(200).json({
    success: true,
    count: locations.length,
    data: locations,
  });
};

// ======================================
// GET ONE
// ======================================

export const getLocationById = async (req, res) => {
  const location = await getLocationByIdService(req.params.id, req.areaScope);

  return res.status(200).json({
    success: true,
    data: location,
  });
};

// ======================================
// UPDATE
// ======================================

export const updateLocation = async (req, res) => {
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
};

// ======================================
// DELETE
// ======================================

export const deleteLocation = async (req, res) => {
  await deleteLocationService(req.params.id, req.areaScope);

  return res.status(200).json({
    success: true,
    message: "Location deleted successfully",
  });
};

// ======================================
// REORDER
// ======================================

export const reorderLocations = async (req, res) => {
  await reorderLocationsService(req.body, req.areaScope);

  return res.status(200).json({
    success: true,
    message: "Locations reordered successfully.",
  });
};
