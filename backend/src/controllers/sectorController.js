import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

import {
  createSectorService,
  getSectorsService,
  getSectorByIdService,
  updateSectorService,
  deleteSectorService,
  reorderSectorsService,
} from "../services/sector/sector.service.js";

// ======================================
// CREATE
// ======================================

export const createSector = async (req, res) => {
  try {
    const sector = await createSectorService(req.body, req.areaScope);

    return res.status(201).json({
      success: true,
      message: "Sector created successfully",
      data: sector,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "Sector already exists");
    }

    throw error;
  }
};

// ======================================
// GET ALL
// ======================================

export const getSectors = async (req, res) => {
  const sectors = await getSectorsService(req.query, req.areaScope);

  return res.status(200).json({
    success: true,
    count: sectors.length,
    data: sectors,
  });
};

// ======================================
// GET ONE
// ======================================

export const getSectorById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid sector ID");
  }

  const sector = await getSectorByIdService(id, req.areaScope);

  return res.status(200).json({
    success: true,
    data: sector,
  });
};

// ======================================
// UPDATE
// ======================================

export const updateSector = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, "Invalid sector ID");
    }

  const sector = await updateSectorService(id, req.body, req.areaScope);

    return res.status(200).json({
      success: true,
      message: "Sector updated successfully",
      data: sector,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "Sector name or code already exists");
    }

    throw error;
  }
};

// ======================================
// DELETE
// ======================================

export const deleteSector = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid sector ID");
  }

  await deleteSectorService(id, req.areaScope);

  return res.status(200).json({
    success: true,
    message: "Sector deleted successfully",
  });
};

// ======================================
// REORDER
// ======================================

export const reorderSectors = async (req, res) => {
  await reorderSectorsService(req.body.sectors, req.areaScope);

  return res.status(200).json({
    success: true,
    message: "Sectors reordered successfully.",
  });
};
