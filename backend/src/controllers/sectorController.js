// controllers/sector.controller.js

import Sector from "../models/Sector.js";
import Location from "../models/Location.js";

/**
 * Create Sector
 */
export const createSector = async (req, res) => {
  try {
    const { name, code, description } = req.body;

    const trimmedName = name?.trim();
    const trimmedCode = code?.trim().toUpperCase();
    const trimmedDescription = description?.trim() || "";

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        message: "Sector name is required",
      });
    }

    if (!trimmedCode) {
      return res.status(400).json({
        success: false,
        message: "Sector code is required",
      });
    }

    const existing = await Sector.findOne({
      $or: [{ name: trimmedName }, { code: trimmedCode }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Sector already exists",
      });
    }

    const lastSector = await Sector.findOne()
      .sort({ sortOrder: -1 })
      .select("sortOrder")
      .lean();

    const sortOrder = lastSector ? lastSector.sortOrder + 1 : 1;

    const sector = await Sector.create({
      name: trimmedName,
      code: trimmedCode,
      description: trimmedDescription,
      sortOrder,
    });

    return res.status(201).json({
      success: true,
      message: "Sector created successfully",
      data: sector,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Sectors
 */
export const getSectors = async (req, res) => {
  try {
    const { search, isActive } = req.query;

    const query = {};

    if (search?.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { code: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const sectors = await Sector.find(query)
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: sectors.length,
      data: sectors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Single Sector
 */
export const getSectorById = async (req, res) => {
  try {
    const sector = await Sector.findById(req.params.id).lean();

    if (!sector) {
      return res.status(404).json({
        success: false,
        message: "Sector not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: sector,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Sector
 */
export const updateSector = async (req, res) => {
  try {
    const { name, code, description, isActive } = req.body;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (code !== undefined) {
      updateData.code = code.trim().toUpperCase();
    }

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const currentSector = await Sector.findById(req.params.id);

    if (!currentSector) {
      return res.status(404).json({
        success: false,
        message: "Sector not found",
      });
    }

    const finalName = updateData.name ?? currentSector.name;
    const finalCode = updateData.code ?? currentSector.code;

    const existing = await Sector.findOne({
      _id: { $ne: req.params.id },
      $or: [{ name: finalName }, { code: finalCode }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Sector name or code already exists",
      });
    }

    const sector = await Sector.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Sector updated successfully",
      data: sector,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Sector
 */
export const deleteSector = async (req, res) => {
  try {
    const sector = await Sector.findById(req.params.id);

    const locationExists = await Location.exists({ sector: req.params.id });

    if (locationExists) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete sector because it contains locations.",
      });
    }

    if (!sector) {
      return res.status(404).json({
        success: false,
        message: "Sector not found",
      });
    }

    await sector.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Sector deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Reorder Sectors
 */
export const reorderSectors = async (req, res) => {
  try {
    const { sectors } = req.body;

    if (!Array.isArray(sectors) || sectors.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Sectors array is required.",
      });
    }

    const existingSectors = await Sector.find({
      _id: { $in: sectors.map(({ _id }) => _id) },
    }).select("_id");

    if (existingSectors.length !== sectors.length) {
      return res.status(400).json({
        success: false,
        message: "One or more sectors do not exist.",
      });
    }

    const bulkOperations = sectors.map(({ _id, sortOrder }) => ({
      updateOne: {
        filter: { _id },
        update: {
          $set: {
            sortOrder,
          },
        },
      },
    }));

    await Sector.bulkWrite(bulkOperations);

    return res.status(200).json({
      success: true,
      message: "Sectors reordered successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
