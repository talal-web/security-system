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

export const createSector = async (req, res, next) => {
  try {
    const sector = await createSectorService(req.body);

    return res.status(201).json({
      success: true,
      message: "Sector created successfully",
      data: sector,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ApiError(409, "Sector already exists"));
    }
    return next(error);
  }
};

export const getSectors = async (req, res, next) => {
  try {
    const sectors = await getSectorsService(req.query);

    return res.status(200).json({
      success: true,
      count: sectors.length,
      data: sectors,
    });
  } catch (error) {
    return next(error);
  }
};

export const getSectorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, "Invalid sector ID");
    }

    const sector = await getSectorByIdService(id);

    return res.status(200).json({
      success: true,
      data: sector,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateSector = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, "Invalid sector ID");
    }

    const sector = await updateSectorService(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Sector updated successfully",
      data: sector,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ApiError(409, "Sector name or code already exists"));
    }
    return next(error);
  }
};

export const deleteSector = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, "Invalid sector ID");
    }

    await deleteSectorService(id);

    return res.status(200).json({
      success: true,
      message: "Sector deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export const reorderSectors = async (req, res, next) => {
  try {
    await reorderSectorsService(req.body.sectors);

    return res.status(200).json({
      success: true,
      message: "Sectors reordered successfully.",
    });
  } catch (error) {
    return next(error);
  }
};
