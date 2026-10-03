import mongoose from "mongoose";
import Sector from "../../models/Sector.js";
import Location from "../../models/Location.js";
import ApiError from "../../utils/ApiError.js";

// ======================================
// AREA SCOPE
// ======================================

const getAreaId = (areaScope = {}) => {
  const areaId = areaScope.areaId;

  if (!areaId || !mongoose.Types.ObjectId.isValid(areaId)) {
    throw new ApiError(403, "Valid area scope is required");
  }

  return new mongoose.Types.ObjectId(areaId);
};

const validateSectorId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid sector ID");
  }
};

// ======================================
// CREATE
// ======================================

export const createSectorService = async (data, areaScope) => {
  const areaId = getAreaId(areaScope);
  const { name, code, description } = data;

  const trimmedName = name?.trim();
  const trimmedCode = code?.trim().toUpperCase();
  const trimmedDescription = description?.trim() || "";

  if (!trimmedName) {
    throw new ApiError(400, "Sector name is required");
  }

  if (!trimmedCode) {
    throw new ApiError(400, "Sector code is required");
  }

  const existing = await Sector.findOne({
    area: areaId,
    $or: [{ name: trimmedName }, { code: trimmedCode }],
  });

  if (existing) {
    throw new ApiError(400, "Sector already exists");
  }

  const lastSector = await Sector.findOne({ area: areaId })
    .sort({ sortOrder: -1 })
    .select("sortOrder")
    .lean();

  const sortOrder = lastSector ? lastSector.sortOrder + 1 : 1;

  return Sector.create({
    name: trimmedName,
    code: trimmedCode,
    area: areaId,
    description: trimmedDescription,
    sortOrder,
  });
};

// ======================================
// GET ALL
// ======================================

export const getSectorsService = async (
  { search, isActive } = {},
  areaScope,
) => {
  const areaId = getAreaId(areaScope);
  const query = { area: areaId };

  if (search?.trim()) {
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    query.$or = [
      { name: { $regex: escapedSearch, $options: "i" } },
      { code: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  if (isActive !== undefined) {
    if (isActive !== "true" && isActive !== "false") {
      throw new ApiError(400, "Invalid isActive value");
    }

    query.isActive = isActive === "true";
  }

  return Sector.find(query)
    .populate("area", "name")
    .sort({ sortOrder: 1, name: 1 })
    .lean();
};

// ======================================
// GET ONE
// ======================================

export const getSectorByIdService = async (id, areaScope) => {
  const areaId = getAreaId(areaScope);
  validateSectorId(id);

  const sector = await Sector.findOne({
    _id: id,
    area: areaId,
  })
    .populate("area", "name")
    .lean();

  if (!sector) {
    throw new ApiError(404, "Sector not found");
  }

  return sector;
};

// ======================================
// UPDATE
// ======================================

export const updateSectorService = async (id, body, areaScope) => {
  const areaId = getAreaId(areaScope);
  validateSectorId(id);

  const { name, code, description, isActive } = body;
  const updateData = {};

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      throw new ApiError(400, "Sector name is required");
    }

    updateData.name = name.trim();
  }

  if (code !== undefined) {
    if (typeof code !== "string" || !code.trim()) {
      throw new ApiError(400, "Sector code is required");
    }

    updateData.code = code.trim().toUpperCase();
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      throw new ApiError(400, "Invalid sector description");
    }

    updateData.description = description.trim();
  }

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      throw new ApiError(400, "Invalid isActive value");
    }

    updateData.isActive = isActive;
  }

  const currentSector = await Sector.findOne({
    _id: id,
    area: areaId,
  });

  if (!currentSector) {
    throw new ApiError(404, "Sector not found");
  }

  const finalName = updateData.name ?? currentSector.name;
  const finalCode = updateData.code ?? currentSector.code;

  const existing = await Sector.findOne({
    _id: { $ne: id },
    area: areaId,
    $or: [{ name: finalName }, { code: finalCode }],
  });

  if (existing) {
    throw new ApiError(400, "Sector name or code already exists");
  }

  return Sector.findOneAndUpdate(
    {
      _id: id,
      area: areaId,
    },
    updateData,
    {
      new: true,
      runValidators: true,
    },
  ).populate("area", "name");
};

// ======================================
// DELETE
// ======================================

export const deleteSectorService = async (id, areaScope) => {
  const areaId = getAreaId(areaScope);
  validateSectorId(id);

  const sector = await Sector.findOne({
    _id: id,
    area: areaId,
  });

  if (!sector) {
    throw new ApiError(404, "Sector not found");
  }

  const locationExists = await Location.exists({
    sector: sector._id,
  });

  if (locationExists) {
    throw new ApiError(
      400,
      "Cannot delete sector because it contains locations.",
    );
  }

  await sector.deleteOne();

  return true;
};

// ======================================
// REORDER
// ======================================

export const reorderSectorsService = async (sectors, areaScope) => {
  const areaId = getAreaId(areaScope);

  if (!Array.isArray(sectors) || sectors.length === 0) {
    throw new ApiError(400, "Sectors array is required.");
  }

  const ids = sectors.map(({ _id }) => _id);

  if (
    ids.some((id) => !mongoose.Types.ObjectId.isValid(id)) ||
    new Set(ids.map(String)).size !== ids.length
  ) {
    throw new ApiError(400, "Invalid or duplicate sector IDs.");
  }

  const sortOrders = sectors.map(({ sortOrder }) => sortOrder);

  if (
    sortOrders.some((value) => !Number.isInteger(value) || value < 0) ||
    new Set(sortOrders).size !== sortOrders.length
  ) {
    throw new ApiError(
      400,
      "Each sortOrder must be a unique non-negative integer.",
    );
  }

  const existingSectors = await Sector.find({
    _id: { $in: ids },
    area: areaId,
  }).select("_id");

  if (existingSectors.length !== sectors.length) {
    throw new ApiError(
      400,
      "One or more sectors do not belong to the selected area.",
    );
  }

  const bulkOperations = sectors.map(({ _id, sortOrder }) => ({
    updateOne: {
      filter: {
        _id,
        area: areaId,
      },
      update: {
        $set: { sortOrder },
      },
    },
  }));

  await Sector.bulkWrite(bulkOperations);

  return true;
};
