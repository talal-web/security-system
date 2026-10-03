import Area from "../../models/Area.js";
import Employee from "../../models/Employee.js";
import Sector from "../../models/Sector.js";
import ApiError from "../../utils/ApiError.js";
import { getPermittedAreaIds } from "../../utils/areaScope.js";
// ======================================
// Create Area
// ======================================

export const createAreaService = async ({ name, description }) => {
  const trimmedName = name?.trim();
  const trimmedDescription = description?.trim() || "";

  if (!trimmedName) {
    throw new ApiError(400, "Area name is required");
  }

  const existing = await Area.findOne({
    name: { $regex: `^${trimmedName}$`, $options: "i" },
  });

  if (existing) {
    throw new ApiError(400, "Area already exists");
  }

  const lastArea = await Area.findOne()
    .sort({ sortOrder: -1 })
    .select("sortOrder")
    .lean();

  const sortOrder = lastArea ? lastArea.sortOrder + 1 : 1;

  const area = await Area.create({
    name: trimmedName,
    description: trimmedDescription,
    sortOrder,
  });

  return area;
};

// ======================================
// Get All Areas
// ======================================

// ======================================
// Get All Areas
// ======================================

export const getAreasService = async ({ search, isActive } = {}, user) => {
  const query = {};

  if (search?.trim()) {
    query.name = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  // Admins/developers can view all areas matching the filters.
  // Other roles are restricted to their permitted areas.
  if (user?.role !== "admin" && user?.role !== "developer") {
    const permittedIds = getPermittedAreaIds(user);

    query._id = { $in: permittedIds };
  }

  return Area.find(query).sort({ sortOrder: 1, name: 1 }).lean();
};

// ======================================
// Get Single Area
// ======================================

export const getAreaByIdService = async ({ id }) => {
  const area = await Area.findById(id).lean();

  if (!area) {
    throw new ApiError(404, "Area not found");
  }

  return area;
};

// ======================================
// Update Area
// ======================================

export const updateAreaService = async ({
  id,
  name,
  description,
  isActive,
}) => {
  const updateData = {};

  if (name !== undefined) {
    const trimmedName = name?.trim();

    if (!trimmedName) {
      throw new ApiError(400, "Area name cannot be empty");
    }

    updateData.name = trimmedName;
  }

  if (description !== undefined) {
    updateData.description = description?.trim() || "";
  }

  if (isActive !== undefined) {
    updateData.isActive = isActive;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No fields provided for update");
  }

  const currentArea = await Area.findById(id);

  if (!currentArea) {
    throw new ApiError(404, "Area not found");
  }

  if (updateData.name !== undefined) {
    const existing = await Area.findOne({
      _id: { $ne: id },
      name: {
        $regex: `^${updateData.name}$`,
        $options: "i",
      },
    });

    if (existing) {
      throw new ApiError(400, "Area name already exists");
    }
  }

  const area = await Area.findByIdAndUpdate(
    id,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    },
  );

  return area;
};

// ======================================
// Delete Area
// ======================================

export const deleteAreaService = async ({ id }) => {
  const area = await Area.findById(id);

  if (!area) {
    throw new ApiError(404, "Area not found");
  }

  const sectorExists = await Sector.exists({ area: id });

  if (sectorExists) {
    throw new ApiError(400, "Cannot delete area because it contains sectors.");
  }

  const employeeExists = await Employee.exists({
    area: id,
  });

  if (employeeExists) {
    throw new ApiError(
      400,
      "Cannot delete area because it contains employees.",
    );
  }

  await area.deleteOne();
};

// ======================================
// Reorder Areas
// ======================================

export const reorderAreasService = async ({ areas }) => {
  if (!Array.isArray(areas) || areas.length === 0) {
    throw new ApiError(400, "Areas array is required.");
  }

  const ids = areas.map(({ _id }) => _id);

  if (new Set(ids.map(String)).size !== ids.length) {
    throw new ApiError(400, "Duplicate area IDs are not allowed.");
  }

  const existingAreas = await Area.find({
    _id: { $in: ids },
  }).select("_id");

  if (existingAreas.length !== areas.length) {
    throw new ApiError(400, "One or more areas do not exist.");
  }

  const validSortOrders = areas.every(
    ({ sortOrder }) => Number.isInteger(sortOrder) && sortOrder >= 0,
  );

  if (!validSortOrders) {
    throw new ApiError(400, "Each sortOrder must be a non-negative integer.");
  }

  const bulkOperations = areas.map(({ _id, sortOrder }) => ({
    updateOne: {
      filter: { _id },
      update: {
        $set: { sortOrder },
      },
    },
  }));

  await Area.bulkWrite(bulkOperations);
};
