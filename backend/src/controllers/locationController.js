// controllers/location.controller.js

import Location from "../models/Location.js";

/**
 * Create Location
 */
export const createLocation = async (req, res) => {
  try {
    const { name, address, sector } = req.body;

    const existing = await Location.findOne({
      name: name.trim(),
      sector,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Location already exists in this sector",
      });
    }

    // Get the highest sort order
    const lastLocation = await Location.findOne()
      .sort({ sortOrder: -1 })
      .select("sortOrder")
      .lean();

    const sortOrder = lastLocation ? lastLocation.sortOrder + 1 : 1;

    const location = await Location.create({
      name: name.trim(),
      address: address?.trim() || "",
      sector,
      sortOrder,
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
    const { search, sector, isActive } = req.query;

    const query = {};

    if (search) {
      query.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    if (sector) {
      query.sector = sector;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const locations = await Location.find(query).sort({
      sortOrder: 1,
      name: 1, // fallback if sortOrder is duplicated
    });

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
    const { name, sector } = req.body;

    // Check if another location already exists with same name and sector
    const existing = await Location.findOne({
      name,
      sector,
      _id: { $ne: req.params.id }, // exclude current record
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Location already exists in this sector",
      });
    }

    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Location updated successfully",
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

export const reorderLocations = async (req, res) => {
  try {
    const { sector, locations } = req.body;

    if (!sector) {
      return res.status(400).json({
        success: false,
        message: "Sector is required.",
      });
    }

    if (!Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Locations array is required.",
      });
    }

    // Verify all locations belong to the given sector
    const existingLocations = await Location.find({
      _id: { $in: locations.map((location) => location._id) },
      sector,
    }).select("_id");

    if (existingLocations.length !== locations.length) {
      return res.status(400).json({
        success: false,
        message: "One or more locations do not belong to the selected sector.",
      });
    }

    const bulkOperations = locations.map(({ _id, sortOrder }) => ({
      updateOne: {
        filter: {
          _id,
          sector,
        },
        update: {
          $set: {
            sortOrder,
          },
        },
      },
    }));

    await Location.bulkWrite(bulkOperations);

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
