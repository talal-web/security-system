// services/employeeService.js

import mongoose from "mongoose";

import Employee from "../../models/Employee.js";
import EmployeeSalary from "../../models/EmployeeSalary.js";
import Area from "../../models/Area.js";
import Sector from "../../models/Sector.js";
import Location from "../../models/Location.js";

import uploadToCloudinary from "../../utils/uploadToCloudinary.js";
import generateEmpId from "../../utils/generateEmpId.js";
import { normalizeCnic, normalizePhone } from "../../utils/normalize.js";
import { getPermittedAreaIds } from "../../utils/areaScope.js";

// ======================================
// ERROR HELPER
// ======================================

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// ======================================
// DATE UTILITY
// ======================================

const firstDayOfMonthUTC = (date) => {
  const d = new Date(date);

  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
};

// ======================================
// EMPLOYEE DATE VALIDATION
// ======================================

const validateEmployeeDates = ({ status, entryDate, exitDate }) => {
  if (status === "active") {
    if (!entryDate) {
      throw createError("Entry date is required for active employees", 400);
    }

    if (exitDate) {
      throw createError("Active employees cannot have an exit date", 400);
    }
  }

  if (entryDate) {
    const parsedEntryDate = new Date(entryDate);

    if (Number.isNaN(parsedEntryDate.getTime())) {
      throw createError("Invalid entry date", 400);
    }
  }

  if (exitDate) {
    const parsedExitDate = new Date(exitDate);

    if (Number.isNaN(parsedExitDate.getTime())) {
      throw createError("Invalid exit date", 400);
    }

    if (entryDate && parsedExitDate < new Date(entryDate)) {
      throw createError("Exit date cannot be earlier than entry date", 400);
    }
  }
};

// ======================================
// NORMALIZATION
// ======================================

const normalizeEmployeeData = (data) => {
  const normalized = { ...data };

  if (normalized.cnic !== undefined) {
    normalized.cnic = normalizeCnic(normalized.cnic);
  }

  if (normalized.phone1 !== undefined) {
    normalized.phone1 = normalizePhone(normalized.phone1);
  }

  if (normalized.phone2 !== undefined) {
    normalized.phone2 = normalizePhone(normalized.phone2);
  }

  return normalized;
};

// ======================================
// IMAGE UPLOAD
// ======================================

const uploadEmployeeImages = async (files = {}) => {
  const images = {};

  const fields = ["profileImage", "cnicFrontImage", "cnicBackImage"];

  for (const field of fields) {
    const file = files[field]?.[0];

    if (!file) continue;

    const result = await uploadToCloudinary(file.buffer);
    images[field] = result.secure_url;
  }

  return images;
};

// ======================================
// AREA VALIDATION
// ======================================

const validateArea = async (areaId) => {
  if (areaId === undefined || areaId === null || areaId === "") {
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(areaId)) {
    throw createError("Invalid area ID");
  }

  const area = await Area.findById(areaId);

  if (!area) {
    throw createError("Area not found");
  }

  return area._id;
};

const validateSector = async (sectorId, areaId = null) => {
  if (sectorId === undefined || sectorId === null || sectorId === "") {
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(sectorId)) {
    throw createError("Invalid sector ID");
  }

  const sector = await Sector.findById(sectorId).lean();

  if (!sector) {
    throw createError("Sector not found");
  }

  if (areaId && sector.area?.toString() !== areaId.toString()) {
    throw createError(
      "Area, sector, and current location must belong to the same area",
    );
  }

  return sector;
};

const validateLocation = async (locationId, sectorId = null) => {
  if (locationId === undefined || locationId === null || locationId === "") {
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(locationId)) {
    throw createError("Invalid current location ID");
  }

  const location = await Location.findById(locationId).lean();

  if (!location) {
    throw createError("Current location not found");
  }

  if (sectorId && location.sector?.toString() !== sectorId.toString()) {
    throw createError(
      "Area, sector, and current location must belong to the same area",
    );
  }

  return location;
};

export const validateEmployeeAreaRelationship = (
  employeeData,
  { areaId, sectorDoc, locationDoc },
) => {
  if (!employeeData) return;

  const selectedArea = employeeData.area ?? areaId ?? null;
  const selectedSector = employeeData.sector ?? sectorDoc?._id ?? null;
  const selectedLocation =
    employeeData.currentLocation ?? locationDoc?._id ?? null;

  if (
    selectedArea &&
    sectorDoc &&
    sectorDoc.area?.toString() !== selectedArea.toString()
  ) {
    throw createError(
      "Area, sector, and current location must belong to the same area",
    );
  }

  if (
    selectedSector &&
    locationDoc &&
    locationDoc.sector?.toString() !== selectedSector.toString()
  ) {
    throw createError(
      "Area, sector, and current location must belong to the same area",
    );
  }

  if (
    selectedArea &&
    selectedSector &&
    sectorDoc &&
    sectorDoc.area?.toString() !== selectedArea.toString()
  ) {
    throw createError(
      "Area, sector, and current location must belong to the same area",
    );
  }

  if (
    selectedLocation &&
    selectedSector &&
    locationDoc &&
    locationDoc.sector?.toString() !== selectedSector.toString()
  ) {
    throw createError(
      "Area, sector, and current location must belong to the same area",
    );
  }
};

// ======================================
// CREATE EMPLOYEE
// ======================================

export const createEmployeeService = async ({
  data,
  files,
  userId,
  user = null,
  areaScope = null,
}) => {
  const {
    name,
    fatherName,
    birthDate,
    cnic,
    address,
    phone1,
    phone2,
    education,
    designation,
    monthlySalary,
    reference,
    area,
    sector,
    status,
    entryDate,
    exitDate,
    notes,
    currentLocation,
    defaultShift,
  } = data;

  const effectiveStatus = status || "active";

  if (!name || !fatherName || !birthDate || !cnic || !phone1 || !designation) {
    throw createError("Required fields are missing");
  }

  validateEmployeeDates({
    status: effectiveStatus,
    entryDate,
    exitDate,
  });

  const initialSalary = Number(monthlySalary);

  if (
    monthlySalary === undefined ||
    monthlySalary === null ||
    monthlySalary === "" ||
    !Number.isFinite(initialSalary) ||
    initialSalary < 0
  ) {
    throw createError(
      "A valid monthlySalary is required to create an employee",
    );
  }

  const validatedArea = await validateArea(area);

  if (user && user.role !== "admin" && user.role !== "developer") {
    const permittedAreas =
      areaScope?.permittedAreaIds || getPermittedAreaIds(user);

    if (!permittedAreas.length) {
      throw createError("Unauthorized: no area access assigned", 403);
    }

    if (!validatedArea) {
      throw createError("Area is required", 400);
    }

    if (!permittedAreas.includes(String(validatedArea))) {
      throw createError("Unauthorized area access", 403);
    }
  }

  const normalized = normalizeEmployeeData({
    cnic,
    phone1,
    phone2,
  });

  const existing = await Employee.findOne({
    cnic: normalized.cnic,
  });

  if (existing) {
    throw createError("Employee with this CNIC already exists", 400);
  }

  const validatedSector = await validateSector(sector, validatedArea);
  const validatedLocation = await validateLocation(
    currentLocation,
    validatedSector?._id ?? null,
  );

  validateEmployeeAreaRelationship(
    {
      area: validatedArea,
      sector: validatedSector?._id ?? null,
      currentLocation: validatedLocation?._id ?? null,
    },
    {
      areaId: validatedArea,
      sectorDoc: validatedSector,
      locationDoc: validatedLocation,
    },
  );

  const empId = await generateEmpId();
  const images = await uploadEmployeeImages(files);

  const session = await mongoose.startSession();
  let employee;

  try {
    await session.withTransaction(async () => {
      const [createdEmployee] = await Employee.create(
        [
          {
            empId,
            name,
            fatherName,
            birthDate,
            cnic: normalized.cnic,
            address,
            phone1: normalized.phone1,
            phone2: normalized.phone2,

            education,
            designation,

            reference,
            area: validatedArea,
            sector: validatedSector?._id || null,

            status: status || "active",
            defaultShift: defaultShift || null,

            entryDate,
            exitDate: exitDate || null,
            notes,

            currentLocation: validatedLocation?._id || null,

            profileImage: images.profileImage || "",
            cnicFrontImage: images.cnicFrontImage || "",
            cnicBackImage: images.cnicBackImage || "",
          },
        ],
        { session },
      );

      const effectiveFrom = firstDayOfMonthUTC(
        createdEmployee.entryDate || new Date(),
      );

      await EmployeeSalary.create(
        [
          {
            employee: createdEmployee._id,
            monthlySalary: initialSalary,
            effectiveFrom,
            reason: "initial_salary",
            createdBy: userId,
          },
        ],
        { session },
      );

      employee = createdEmployee;
    });
  } finally {
    await session.endSession();
  }

  return employee;
};

// ======================================
// GET EMPLOYEES
// ======================================

export const getEmployeesService = async (query = {}, areaScope = null) => {
  const normalizeQueryValue = (value) => {
    if (typeof value !== "string") return undefined;

    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  };

  const trustedQuery = { ...query };

  const status = normalizeQueryValue(trustedQuery.status);
  const designation = normalizeQueryValue(trustedQuery.designation);
  const area = normalizeQueryValue(trustedQuery.area);
  const sector = normalizeQueryValue(trustedQuery.sector);
  const education = normalizeQueryValue(trustedQuery.education);
  const currentLocation = normalizeQueryValue(trustedQuery.currentLocation);
  const search = normalizeQueryValue(trustedQuery.search);
  const entryFrom = normalizeQueryValue(trustedQuery.entryFrom);
  const entryTo = normalizeQueryValue(trustedQuery.entryTo);
  const hasExited = normalizeQueryValue(trustedQuery.hasExited);
  const defaultShift = normalizeQueryValue(trustedQuery.defaultShift);
  const unassigned = normalizeQueryValue(trustedQuery.unassigned);

  const filter = {};
  const andConditions = [];

  // STATUS
  if (status) {
    filter.status = status;
  }

  // DESIGNATION
  if (designation) {
    filter.designation = designation;
  }

  // AREA: client-selected filter (not authorization)
  if (area && unassigned !== "area") {
    if (!mongoose.Types.ObjectId.isValid(area)) {
      throw createError("Invalid area.");
    }

    filter.area = area;
  }

  // SECTOR
  if (sector && unassigned !== "sector") {
    if (!mongoose.Types.ObjectId.isValid(sector)) {
      throw createError("Invalid sector.");
    }

    filter.sector = sector;
  }

  // DEFAULT SHIFT
  if (defaultShift) {
    filter.defaultShift = defaultShift;
  }

  // CURRENT LOCATION
  if (currentLocation) {
    if (!mongoose.Types.ObjectId.isValid(currentLocation)) {
      throw createError("Invalid current location.");
    }

    filter.currentLocation = currentLocation;
  }

  // EDUCATION
  if (education === "unassigned") {
    andConditions.push({
      $or: [
        { education: null },
        { education: "" },
        { education: { $exists: false } },
      ],
    });
  } else if (education) {
    filter.education = education;
  }

  // UNASSIGNED AREA
  if (unassigned === "area") {
    if (areaScope && !areaScope.isAdmin) {
      throw createError("You cannot filter for unassigned employees.", 403);
    }

    andConditions.push({
      $or: [{ area: null }, { area: { $exists: false } }],
    });
  }

  // UNASSIGNED SECTOR
  if (unassigned === "sector") {
    andConditions.push({
      $or: [{ sector: null }, { sector: { $exists: false } }],
    });
  }

  // UNASSIGNED SHIFT
  if (unassigned === "shift") {
    andConditions.push({
      $or: [
        { defaultShift: null },
        { defaultShift: "" },
        { defaultShift: { $exists: false } },
      ],
    });
  }

  // UNASSIGNED CURRENT LOCATION
  if (unassigned === "currentLocation") {
    const activeIds = (
      await Location.find({ isActive: true }, "_id").lean()
    ).map((location) => location._id);

    andConditions.push({
      $or: [
        { currentLocation: null },
        { currentLocation: { $exists: false } },
        { currentLocation: { $nin: activeIds } },
      ],
    });
  }

  // SEARCH
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    andConditions.push({
      $or: [
        { empId: { $regex: escaped, $options: "i" } },
        { name: { $regex: escaped, $options: "i" } },
      ],
    });
  }

  // ENTRY DATE RANGE
  if (entryFrom || entryTo) {
    filter.entryDate = {};

    if (entryFrom) {
      const from = new Date(entryFrom);

      if (Number.isNaN(from.getTime())) {
        throw createError("Invalid entryFrom date.");
      }

      filter.entryDate.$gte = from;
    }

    if (entryTo) {
      const to = new Date(entryTo);

      if (Number.isNaN(to.getTime())) {
        throw createError("Invalid entryTo date.");
      }

      filter.entryDate.$lte = to;
    }

    if (
      filter.entryDate.$gte &&
      filter.entryDate.$lte &&
      filter.entryDate.$gte > filter.entryDate.$lte
    ) {
      throw createError("entryFrom must be before entryTo.");
    }
  }

  // EXIT STATUS
  if (hasExited === "true") {
    filter.exitDate = { $ne: null };
  }

  if (hasExited === "false") {
    filter.exitDate = null;
  }

  // COMBINE ORDINARY FILTERS
  if (Object.keys(filter).length > 0) {
    andConditions.push(filter);
  }

  // APPLY TRUSTED AREA SCOPE
  if (areaScope) {
    const scopeFilter = areaScope.filter || {};

    if (Object.keys(scopeFilter).length > 0) {
      andConditions.push(scopeFilter);
    }

    if (
      !areaScope.isAdmin &&
      (!areaScope.permittedAreaIds || areaScope.permittedAreaIds.length === 0)
    ) {
      throw createError("No area access assigned.", 403);
    }
  }

  // FINAL QUERY
  const finalFilter =
    andConditions.length === 0
      ? {}
      : andConditions.length === 1
        ? andConditions[0]
        : { $and: andConditions };

  const employees = await Employee.find(finalFilter)
    .populate("area", "name")
    .populate("sector", "name code")
    .populate("currentLocation", "name")
    .sort({ empId: 1 });

  return employees;
};

// ======================================
// LOOKUP EMPLOYEE BY EMPID
// ======================================

export const lookupEmployeeService = async (empId) => {
  if (!empId || typeof empId !== "string" || !empId.trim()) {
    throw createError("Employee ID (empId) is required");
  }

  const trimmedEmpId = empId.trim();

  const escaped = trimmedEmpId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const employee = await Employee.findOne({
    empId: {
      $regex: `^${escaped}$`,
      $options: "i",
    },
  }).select("_id empId name fatherName designation status area");

  if (!employee) {
    throw createError("Employee not found", 404);
  }

  return employee;
};

// ======================================
// GET SINGLE EMPLOYEE
// ======================================

export const getEmployeeByIdService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid employee ID");
  }

  const employee = await Employee.findById(id)
    .populate("area", "name")
    .populate("currentLocation", "name")
    .populate("sector", "name");

  if (!employee) {
    throw createError("Employee not found", 404);
  }

  return employee;
};

// ======================================
// UPDATE EMPLOYEE
// ======================================

export const updateEmployeeService = async ({
  id,
  data,
  files,
  user = null,
  areaScope = null,
}) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid employee ID");
  }

  const employee = await Employee.findById(id);

  if (!employee) {
    throw createError("Employee not found", 404);
  }

  const normalized = normalizeEmployeeData(data);

  // CNIC VALIDATION

  if (normalized.cnic) {
    const existing = await Employee.findOne({
      cnic: normalized.cnic,
      _id: { $ne: id },
    });

    if (existing) {
      throw createError("Another employee already uses this CNIC");
    }
  }

  // AREA VALIDATION

  if (data.area !== undefined) {
    normalized.area = await validateArea(data.area);
  }

  if (user && user.role !== "admin" && user.role !== "developer") {
    const permittedAreas =
      areaScope?.permittedAreaIds || getPermittedAreaIds(user);
    const targetArea = normalized.area ?? employee.area ?? null;

    if (!targetArea || !permittedAreas.includes(String(targetArea))) {
      throw createError("Unauthorized area access", 403);
    }
  }

  const selectedArea = normalized.area ?? employee.area ?? null;
  const selectedSector =
    normalized.sector !== undefined
      ? normalized.sector
      : (employee.sector ?? null);

  const selectedSectorDoc =
    selectedSector && (await Sector.findById(selectedSector).lean());

  const selectedLocation =
    data.currentLocation !== undefined
      ? String(data.currentLocation).trim() || null
      : (employee.currentLocation ?? null);

  const selectedLocationDoc =
    selectedLocation && (await Location.findById(selectedLocation).lean());

  validateEmployeeAreaRelationship(
    {
      area: selectedArea,
      sector: selectedSector,
      currentLocation: selectedLocation,
    },
    {
      areaId: selectedArea,
      sectorDoc: selectedSectorDoc,
      locationDoc: selectedLocationDoc,
    },
  );

  // ALLOWED FIELDS

  const allowedFields = [
    "name",
    "fatherName",
    "birthDate",
    "cnic",
    "address",
    "phone1",
    "phone2",
    "education",
    "designation",
    "reference",
    "area",
    "sector",
    "defaultShift",
    "status",
    "entryDate",
    "exitDate",
    "notes",
  ];

  const nullableFields = [
    "education",
    "area",
    "sector",
    "defaultShift",
    "exitDate",
  ];

  for (const field of allowedFields) {
    if (normalized[field] === undefined) continue;

    if (nullableFields.includes(field) && normalized[field] === "") {
      employee[field] = null;
      continue;
    }

    employee[field] = normalized[field];
  }

  // CURRENT LOCATION

  if (data.currentLocation !== undefined) {
    const locationId = String(data.currentLocation).trim();

    if (locationId && !mongoose.Types.ObjectId.isValid(locationId)) {
      throw createError("Invalid current location ID");
    }

    const locationDoc =
      locationId && (await Location.findById(locationId).lean());

    if (locationDoc) {
      const targetSector = selectedSector || employee.sector || null;

      if (
        targetSector &&
        locationDoc.sector?.toString() !== targetSector.toString()
      ) {
        throw createError(
          "Area, sector, and current location must belong to the same area",
        );
      }
    }

    employee.currentLocation = locationId || null;
  }

  // IMAGE UPDATES

  const images = await uploadEmployeeImages(files);

  for (const [field, url] of Object.entries(images)) {
    employee[field] = url;
  }

  await employee.save();

  return employee;
};

// ======================================
// DELETE EMPLOYEE
// ======================================

export const deleteEmployeeService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid employee ID");
  }

  const employee = await Employee.findById(id);

  if (!employee) {
    throw createError("Employee not found", 404);
  }

  await employee.deleteOne();

  return employee;
};
