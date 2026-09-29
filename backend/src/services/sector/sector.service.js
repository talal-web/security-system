import Sector from "../../models/Sector.js";
import Location from "../../models/Location.js";
import ApiError from "../../utils/ApiError.js";

export const createSectorService = async ({
  name,
  code,
  description,
  area,
}) => {
  const trimmedName = name?.trim();
  const trimmedCode = code?.trim().toUpperCase();
  const trimmedDescription = description?.trim() || "";
  const trimmedArea = area?.trim();

  if (!trimmedName) throw new ApiError(400, "Sector name is required");
  if (!trimmedArea) throw new ApiError(400, "Area is required");
  if (!trimmedCode) throw new ApiError(400, "Sector code is required");

  const existing = await Sector.findOne({
    area: trimmedArea,
    $or: [{ name: trimmedName }, { code: trimmedCode }],
  });

  if (existing) throw new ApiError(400, "Sector already exists");

  const lastSector = await Sector.findOne()
    .sort({ sortOrder: -1 })
    .select("sortOrder")
    .lean();

  const sortOrder = lastSector ? lastSector.sortOrder + 1 : 1;

  return Sector.create({
    name: trimmedName,
    code: trimmedCode,
    area: trimmedArea,
    description: trimmedDescription,
    sortOrder,
  });
};

export const getSectorsService = async ({ search, isActive, area } = {}) => {
  const query = {};

  if (search?.trim()) {
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    query.$or = [
      { name: { $regex: escapedSearch, $options: "i" } },
      { code: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  if (area) query.area = area;

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  return Sector.find(query)
    .populate("area", "name")
    .sort({ sortOrder: 1, name: 1 })
    .lean();
};

export const getSectorByIdService = async (id) => {
  const sector = await Sector.findById(id).lean();

  if (!sector) throw new ApiError(404, "Sector not found");

  return sector;
};

export const updateSectorService = async (id, body) => {
  const { name, code, description, area, isActive } = body;
  const updateData = {};

  if (name !== undefined) {
    updateData.name = name.trim();
    if (!updateData.name) {
      throw new ApiError(400, "Sector name is required");
    }
  }

  if (code !== undefined) {
    updateData.code = code.trim().toUpperCase();
    if (!updateData.code) {
      throw new ApiError(400, "Sector code is required");
    }
  }

  if (area !== undefined) {
    const trimmedArea = area?.trim();

    if (!trimmedArea) {
      throw new ApiError(400, "Area is required");
    }

    updateData.area = trimmedArea;
  }

  if (description !== undefined) {
    updateData.description = description.trim();
  }

  if (isActive !== undefined) {
    updateData.isActive = isActive;
  }

  const currentSector = await Sector.findById(id);

  if (!currentSector) throw new ApiError(404, "Sector not found");

  const finalName = updateData.name ?? currentSector.name;
  const finalCode = updateData.code ?? currentSector.code;
  const finalArea = updateData.area ?? currentSector.area;

  const existing = await Sector.findOne({
    _id: { $ne: id },
    area: finalArea,
    $or: [{ name: finalName }, { code: finalCode }],
  });

  if (existing) {
    throw new ApiError(400, "Sector name or code already exists");
  }

  return Sector.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("area", "name");
};

export const deleteSectorService = async (id) => {
  const sector = await Sector.findById(id);

  if (!sector) throw new ApiError(404, "Sector not found");

  const locationExists = await Location.exists({ sector: id });

  if (locationExists) {
    throw new ApiError(
      400,
      "Cannot delete sector because it contains locations.",
    );
  }

  await sector.deleteOne();

  return true;
};

export const reorderSectorsService = async (sectors) => {
  if (!Array.isArray(sectors) || sectors.length === 0) {
    throw new ApiError(400, "Sectors array is required.");
  }

  const ids = sectors.map(({ _id }) => _id);

  if (ids.some((id) => !id) || new Set(ids.map(String)).size !== ids.length) {
    throw new ApiError(400, "Invalid or duplicate sector IDs.");
  }

  const existingSectors = await Sector.find({
    _id: { $in: ids },
  }).select("_id");

  if (existingSectors.length !== sectors.length) {
    throw new ApiError(400, "One or more sectors do not exist.");
  }

  const bulkOperations = sectors.map(({ _id, sortOrder }) => {
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      throw new ApiError(400, "Each sortOrder must be a non-negative integer.");
    }

    return {
      updateOne: {
        filter: { _id },
        update: { $set: { sortOrder } },
      },
    };
  });

  await Sector.bulkWrite(bulkOperations);

  return true;
};
