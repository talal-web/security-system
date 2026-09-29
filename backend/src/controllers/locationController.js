import {
  createLocationService,
  getLocationsService,
  getLocationByIdService,
  updateLocationService,
  deleteLocationService,
  reorderLocationsService,
} from "../services/location/location.service.js";

export const createLocation = async (req, res) => {
  try {
    const result = await createLocationService(req.body);

    if (result?.error) {
      return res.status(result.error.status).json({
        success: false,
        message: result.error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Location created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLocations = async (req, res) => {
  try {
    const locations = await getLocationsService(req.query);

    return res.status(200).json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLocationById = async (req, res) => {
  try {
    const location = await getLocationByIdService(req.params.id);

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

export const updateLocation = async (req, res) => {
  try {
    const result = await updateLocationService(req.params.id, req.body);

    if (result?.error) {
      return res.status(result.error.status).json({
        success: false,
        message: result.error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Location updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const deleted = await deleteLocationService(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Location deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const reorderLocations = async (req, res) => {
  try {
    const result = await reorderLocationsService(req.body);

    if (result?.error) {
      return res.status(result.error.status).json({
        success: false,
        message: result.error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Locations reordered successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
