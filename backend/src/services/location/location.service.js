import mongoose from "mongoose";
import Location from "../../models/Location.js";
import Sector from "../../models/Sector.js";
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

const getScopedSector = async (sectorId, areaId, { active = false } = {}) => {
  if (!mongoose.Types.ObjectId.isValid(sectorId)) {
    throw new ApiError(400, "Invalid sector ID");
  }

  const filter = {
    _id: sectorId,
    area: areaId,
  };

  if (active) filter.isActive = true;

  const sector = await Sector.findOne(filter).lean();

  if (!sector) {
    throw new ApiError(404, "Sector not found in selected area");
  }

  return sector;
};

const getScopedLocation = async (id, areaId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid location ID");
  }

  const sectorIds = await Sector.find({ area: areaId }).distinct("_id");

  const location = await Location.findOne({
    _id: id,
    sector: { $in: sectorIds },
  });

  if (!location) {
    throw new ApiError(404, "Location not found in selected area");
  }

  return location;
};

const locationPopulate = {
  path: "sector",
  select: "name code sortOrder isActive area",
  populate: {
    path: "area",
    select: "_id name",
  },
};

// ======================================
// SECTOR COMPATIBILITY
// ======================================

export const validateLocationSectorCompatibility = ({
  area,
  sector,
  sectorDoc,
}) => {
  if (!sectorDoc) return;

  const selectedArea = area ?? sectorDoc.area ?? null;

  if (selectedArea && sectorDoc.area?.toString() !== selectedArea.toString()) {
    throw new ApiError(400, "Area and sector must belong to the same area.");
  }
};

// ======================================
// CREATE
// ======================================

export const createLocationService = async (data, areaScope) => {
  const areaId = getAreaId(areaScope);
  const { name, address, sector } = data;

  const trimmedName = name?.trim();
  const trimmedAddress = address?.trim() || "";

  if (!trimmedName) {
    throw new ApiError(400, "Location name is required");
  }

  if (!sector) {
    throw new ApiError(400, "Sector is required");
  }

  const sectorDoc = await getScopedSector(sector, areaId, {
    active: true,
  });

  validateLocationSectorCompatibility({
    area: areaId,
    sector,
    sectorDoc,
  });

  const existing = await Location.findOne({
    name: trimmedName,
    sector: sectorDoc._id,
  });

  if (existing) {
    throw new ApiError(400, "Location already exists in this sector");
  }

  // Sort order is scoped to this sector.
  const lastLocation = await Location.findOne({
    sector: sectorDoc._id,
  })
    .sort({ sortOrder: -1 })
    .select("sortOrder")
    .lean();

  const sortOrder = lastLocation ? lastLocation.sortOrder + 1 : 1;

  const location = await Location.create({
    name: trimmedName,
    address: trimmedAddress,
    sector: sectorDoc._id,
    sortOrder,
  });

  return location.populate("sector", "name code");
};

// ======================================
// GET ALL
// ======================================

export const getLocationsService = async (queryParams = {}, areaScope) => {
  const areaId = getAreaId(areaScope);
  const { search, sector, isActive } = queryParams;

  const sectorFilter = { area: areaId };

  if (sector) {
    sectorFilter._id = sector;
  }

  const sectors = await Sector.find(sectorFilter).select("_id").lean();

  const sectorIds = sectors.map((item) => item._id);

  if (sector && !sectorIds.length) {
    throw new ApiError(404, "Sector not found in selected area");
  }

  if (!sectorIds.length) return [];

  const filter = {
    sector: { $in: sectorIds },
  };

  if (search?.trim()) {
    filter.name = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  if (isActive !== undefined) {
    if (isActive !== "true" && isActive !== "false") {
      throw new ApiError(400, "Invalid isActive value");
    }

    filter.isActive = isActive === "true";
  }

  return Location.find(filter)
    .populate(locationPopulate)
    .sort({
      sortOrder: 1,
      name: 1,
    })
    .lean();
};

// ======================================
// GET ONE
// ======================================

export const getLocationByIdService = async (id, areaScope) => {
  const areaId = getAreaId(areaScope);

  const location = await getScopedLocation(id, areaId);

  return Location.findById(location._id).populate(locationPopulate).lean();
};

// ======================================
// UPDATE
// ======================================

export const updateLocationService = async (id, data, areaScope) => {
  const areaId = getAreaId(areaScope);
  const { name, address, sector, isActive } = data;

  // Only locations in the selected area can be updated.
  const currentLocation = await getScopedLocation(id, areaId);

  const updateData = {};

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      throw new ApiError(400, "Location name is required");
    }

    updateData.name = name.trim();
  }

  if (address !== undefined) {
    if (typeof address !== "string") {
      throw new ApiError(400, "Invalid location address");
    }

    updateData.address = address.trim();
  }

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      throw new ApiError(400, "Invalid isActive value");
    }

    updateData.isActive = isActive;
  }

  let finalSector = currentLocation.sector;

  if (sector !== undefined) {
    const sectorDoc = await getScopedSector(sector, areaId, {
      active: true,
    });

    validateLocationSectorCompatibility({
      area: areaId,
      sector,
      sectorDoc,
    });

    finalSector = sectorDoc._id;
    updateData.sector = finalSector;
  }

  const finalName = updateData.name ?? currentLocation.name;

  const existing = await Location.findOne({
    _id: { $ne: currentLocation._id },
    name: finalName,
    sector: finalSector,
  });

  if (existing) {
    throw new ApiError(400, "Location already exists in this sector");
  }

  return Location.findOneAndUpdate(
    {
      _id: currentLocation._id,
      sector: {
        $in: await Sector.find({ area: areaId }).distinct("_id"),
      },
    },
    updateData,
    {
      new: true,
      runValidators: true,
    },
  ).populate(locationPopulate);
};

// ======================================
// DELETE
// ======================================

export const deleteLocationService = async (id, areaScope) => {
  const areaId = getAreaId(areaScope);

  const location = await getScopedLocation(id, areaId);

  await location.deleteOne();

  return true;
};

// ======================================
// REORDER
// ======================================

export const reorderLocationsService = async (data, areaScope) => {
  const areaId = getAreaId(areaScope);
  const { sector, locations } = data;

  if (!sector) {
    throw new ApiError(400, "Sector is required.");
  }

  if (!Array.isArray(locations) || locations.length === 0) {
    throw new ApiError(400, "Locations array is required.");
  }

  const sectorDoc = await getScopedSector(sector, areaId, {
    active: true,
  });

  const ids = locations.map(({ _id }) => _id);

  if (
    ids.some((id) => !mongoose.Types.ObjectId.isValid(id)) ||
    new Set(ids.map(String)).size !== ids.length
  ) {
    throw new ApiError(400, "Invalid or duplicate location IDs.");
  }

  const existingLocations = await Location.find({
    _id: { $in: ids },
    sector: sectorDoc._id,
  }).select("_id");

  if (existingLocations.length !== locations.length) {
    throw new ApiError(
      400,
      "One or more locations do not belong to the selected sector.",
    );
  }

  const sortOrders = locations.map(({ sortOrder }) => sortOrder);

  if (
    sortOrders.some((value) => !Number.isInteger(value) || value < 0) ||
    new Set(sortOrders).size !== sortOrders.length
  ) {
    throw new ApiError(400, "Invalid or duplicate sort orders.");
  }

  const bulkOperations = locations.map(({ _id, sortOrder }) => ({
    updateOne: {
      filter: {
        _id,
        sector: sectorDoc._id,
      },
      update: {
        $set: { sortOrder },
      },
    },
  }));

  await Location.bulkWrite(bulkOperations);

  return true;
};
