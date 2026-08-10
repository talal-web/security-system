// controllers/location.controller.js

import Location from "../models/Location.js";
import Sector from "../models/Sector.js";

/**
 * Create Location
 */
export const createLocation = async (req, res) => {
  try {
    const { name, address, sector } = req.body;

    const trimmedName = name?.trim();
    const trimmedAddress = address?.trim() || "";

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        message: "Location name is required",
      });
    }

    if (!sector) {
      return res.status(400).json({
        success: false,
        message: "Sector is required",
      });
    }

    // Verify sector exists
    const sectorExists = await Sector.exists({
      _id: sector,
      isActive: true,
    });

    if (!sectorExists) {
      return res.status(404).json({
        success: false,
        message: "Sector not found",
      });
    }

    // Check duplicate location in same sector
    const existing = await Location.findOne({
      name: trimmedName,
      sector,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Location already exists in this sector",
      });
    }

    // Next sort order
    const lastLocation = await Location.findOne()
      .sort({ sortOrder: -1 })
      .select("sortOrder")
      .lean();

    const sortOrder = lastLocation ? lastLocation.sortOrder + 1 : 1;

    let location = await Location.create({
      name: trimmedName,
      address: trimmedAddress,
      sector,
      sortOrder,
    });

    location = await location.populate("sector", "name code");

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
/**
 * Get All Locations
 */
export const getLocations = async (req, res) => {
  try {
    const { search, sector, isActive } = req.query;

    const query = {};

    if (search?.trim()) {
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

    const locations = await Location.find(query)
      .populate({
        path: "sector",
        select: "name code sortOrder isActive",
      })
      .sort({
        sortOrder: 1,
        name: 1,
      })
      .lean();

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
    const location = await Location.findById(req.params.id)
      .populate({
        path: "sector",
        select: "name code sortOrder isActive",
      })
      .lean();

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
    const { name, address, sector, isActive } = req.body;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (address !== undefined) {
      updateData.address = address.trim();
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    if (sector !== undefined) {
      const sectorExists = await Sector.exists({
        _id: sector,
        isActive: true,
      });

      if (!sectorExists) {
        return res.status(404).json({
          success: false,
          message: "Sector not found",
        });
      }

      updateData.sector = sector;
    }

    // Get current location
    const currentLocation = await Location.findById(req.params.id);

    if (!currentLocation) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    const finalName = updateData.name ?? currentLocation.name;
    const finalSector = updateData.sector ?? currentLocation.sector;

    // Check duplicate
    const existing = await Location.findOne({
      _id: { $ne: req.params.id },
      name: finalName,
      sector: finalSector,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Location already exists in this sector",
      });
    }

    const location = await Location.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    ).populate({
      path: "sector",
      select: "name code sortOrder isActive",
    });

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
/**
 * Delete Location
 */
export const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    await location.deleteOne();

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

/**
 * Reorder Locations
 */
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

    // Verify sector exists
    const sectorExists = await Sector.exists({
      _id: sector,
      isActive: true,
    });

    if (!sectorExists) {
      return res.status(404).json({
        success: false,
        message: "Sector not found.",
      });
    }

    // Verify all locations belong to the given sector
    const existingLocations = await Location.find({
      _id: { $in: locations.map(({ _id }) => _id) },
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
