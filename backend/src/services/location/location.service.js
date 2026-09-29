import Location from "../../models/Location.js";
import Sector from "../../models/Sector.js";

export const validateLocationSectorCompatibility = ({
  area,
  sector,
  sectorDoc,
}) => {
  if (!sectorDoc) return;

  const selectedArea = area ?? sectorDoc.area ?? null;

  if (selectedArea && sectorDoc.area?.toString() !== selectedArea.toString()) {
    throw new Error("Area and sector must belong to the same area.");
  }
};

// CREATE
export const createLocationService = async (data) => {
  const { name, address, sector, area } = data;

  const trimmedName = name?.trim();
  const trimmedAddress = address?.trim() || "";

  if (!trimmedName) {
    return {
      error: { status: 400, message: "Location name is required" },
    };
  }

  if (!sector) {
    return {
      error: { status: 400, message: "Sector is required" },
    };
  }

  const sectorExists = await Sector.findById(sector).lean();

  if (!sectorExists || !sectorExists.isActive) {
    return {
      error: { status: 404, message: "Sector not found" },
    };
  }

  validateLocationSectorCompatibility({
    area,
    sector,
    sectorDoc: sectorExists,
  });

  const existing = await Location.findOne({
    name: trimmedName,
    sector,
  });

  if (existing) {
    return {
      error: {
        status: 400,
        message: "Location already exists in this sector",
      },
    };
  }

  const lastLocation = await Location.findOne()
    .sort({ sortOrder: -1 })
    .select("sortOrder")
    .lean();

  const sortOrder = lastLocation ? lastLocation.sortOrder + 1 : 1;

  const location = await Location.create({
    name: trimmedName,
    address: trimmedAddress,
    sector,
    sortOrder,
  });

  return location.populate("sector", "name code");
};

// GET ALL
export const getLocationsService = async (queryParams) => {
  const { search, sector, area, isActive } = queryParams;
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

  if (area) {
    const sectorsInArea = await Sector.find({ area }).select("_id").lean();

    const sectorIds = sectorsInArea.map((item) => item._id);

    if (sectorIds.length === 0) {
      return [];
    }

    query.sector = { $in: sectorIds };
  }

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  return Location.find(query)
    .populate({
      path: "sector",
      select: "name code sortOrder isActive area",
      populate: {
        path: "area",
        select: "_id name",
      },
    })
    .sort({
      sortOrder: 1,
      name: 1,
    })
    .lean();
};

// GET ONE
export const getLocationByIdService = async (id) => {
  return Location.findById(id)
    .populate({
      path: "sector",
      select: "name code sortOrder isActive area",
      populate: {
        path: "area",
        select: "_id name",
      },
    })
    .lean();
};

// UPDATE
export const updateLocationService = async (id, data) => {
  const { name, address, sector, area, isActive } = data;
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
    const sectorExists = await Sector.findById(sector).lean();

    if (!sectorExists || !sectorExists.isActive) {
      return {
        error: { status: 404, message: "Sector not found" },
      };
    }

    validateLocationSectorCompatibility({
      area,
      sector,
      sectorDoc: sectorExists,
    });

    updateData.sector = sector;
  }

  if (area !== undefined && !sector) {
    const currentLocation = await Location.findById(id)
      .populate({
        path: "sector",
        select: "area",
      })
      .lean();

    const sectorDoc = await Sector.findById(
      currentLocation?.sector?._id,
    ).lean();

    validateLocationSectorCompatibility({
      area,
      sector: currentLocation?.sector?._id,
      sectorDoc,
    });
  }

  const currentLocation = await Location.findById(id);

  if (!currentLocation) {
    return {
      error: { status: 404, message: "Location not found" },
    };
  }

  const finalName = updateData.name ?? currentLocation.name;
  const finalSector = updateData.sector ?? currentLocation.sector;

  const existing = await Location.findOne({
    _id: { $ne: id },
    name: finalName,
    sector: finalSector,
  });

  if (existing) {
    return {
      error: {
        status: 400,
        message: "Location already exists in this sector",
      },
    };
  }

  return Location.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate({
    path: "sector",
    select: "name code sortOrder isActive area",
    populate: {
      path: "area",
      select: "_id name",
    },
  });
};

// DELETE
export const deleteLocationService = async (id) => {
  const location = await Location.findById(id);

  if (!location) {
    return false;
  }

  await location.deleteOne();
  return true;
};

// REORDER
export const reorderLocationsService = async (data) => {
  const { sector, locations } = data;

  if (!sector) {
    return {
      error: { status: 400, message: "Sector is required." },
    };
  }

  if (!Array.isArray(locations) || locations.length === 0) {
    return {
      error: {
        status: 400,
        message: "Locations array is required.",
      },
    };
  }

  const sectorExists = await Sector.exists({
    _id: sector,
    isActive: true,
  });

  if (!sectorExists) {
    return {
      error: { status: 404, message: "Sector not found." },
    };
  }

  const existingLocations = await Location.find({
    _id: { $in: locations.map(({ _id }) => _id) },
    sector,
  }).select("_id");

  if (existingLocations.length !== locations.length) {
    return {
      error: {
        status: 400,
        message: "One or more locations do not belong to the selected sector.",
      },
    };
  }

  const bulkOperations = locations.map(({ _id, sortOrder }) => ({
    updateOne: {
      filter: {
        _id,
        sector,
      },
      update: {
        $set: { sortOrder },
      },
    },
  }));

  await Location.bulkWrite(bulkOperations);

  return true;
};
