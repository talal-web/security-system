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
import { normalizeEmployeeContactData } from "../../utils/employeeContacts.js";
import { getMissingEmployeeImageFields } from "../../utils/employeeImages.js";
import ApiError from "../../utils/ApiError.js";

// ======================================
// AREA SCOPE HELPERS
// ======================================

// enforceAreaScope has already validated exactly one area.
// areaScope.areaId is the single source of truth for every query below.
const getScopedAreaId = (areaScope = {}) => {
  const areaId = areaScope?.areaId;

  if (typeof areaId !== "string" || !areaId.trim()) {
    throw new ApiError(400, "Area selection is required");
  }

  if (!mongoose.Types.ObjectId.isValid(areaId)) {
    throw new ApiError(400, "Invalid area ID");
  }

  return areaId;
};

// Whether the user may place employees into the given area.
const canAccessArea = (areaId, areaScope = {}) => {
  if (areaScope?.isAdmin) return true;

  return (areaScope?.permittedAreaIds || [])
    .map(String)
    .includes(String(areaId));
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
      throw new ApiError(400, "Entry date is required for active employees");
    }

    if (exitDate) {
      throw new ApiError(400, "Active employees cannot have an exit date");
    }
  }

  if (entryDate) {
    const parsedEntryDate = new Date(entryDate);

    if (Number.isNaN(parsedEntryDate.getTime())) {
      throw new ApiError(400, "Invalid entry date");
    }
  }

  if (exitDate) {
    const parsedExitDate = new Date(exitDate);

    if (Number.isNaN(parsedExitDate.getTime())) {
      throw new ApiError(400, "Invalid exit date");
    }

    if (entryDate && parsedExitDate < new Date(entryDate)) {
      throw new ApiError(400, "Exit date cannot be earlier than entry date");
    }
  }
};

// ======================================
// NORMALIZATION
// ======================================

const normalizeEmployeeData = (data) => {
  const normalized = normalizeEmployeeContactData(data, normalizePhone);

  if (normalized.cnic !== undefined) {
    normalized.cnic = normalizeCnic(normalized.cnic);
  }

  if (normalized.phone1 !== undefined) {
    normalized.phone1 = normalizePhone(normalized.phone1);
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
// AREA / SECTOR / LOCATION VALIDATION
// ======================================

const validateArea = async (areaId) => {
  if (areaId === undefined || areaId === null || areaId === "") {
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(areaId)) {
    throw new ApiError(400, "Invalid area ID");
  }

  const area = await Area.findById(areaId);

  if (!area) {
    throw new ApiError(404, "Area not found");
  }

  return area._id;
};

const validateSector = async (sectorId, areaId = null) => {
  if (sectorId === undefined || sectorId === null || sectorId === "") {
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(sectorId)) {
    throw new ApiError(400, "Invalid sector ID");
  }

  const sector = await Sector.findById(sectorId).lean();

  if (!sector) {
    throw new ApiError(404, "Sector not found");
  }

  if (areaId && sector.area?.toString() !== areaId.toString()) {
    throw new ApiError(
      400,
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
    throw new ApiError(400, "Invalid current location ID");
  }

  const location = await Location.findById(locationId).lean();

  if (!location) {
    throw new ApiError(404, "Current location not found");
  }

  if (sectorId && location.sector?.toString() !== sectorId.toString()) {
    throw new ApiError(
      400,
      "Area, sector, and current location must belong to the same area",
    );
  }

  return location;
};

// Kept exported in case other modules import it.
export const validateEmployeeAreaRelationship = (
  employeeData,
  { areaId, sectorDoc, locationDoc },
) => {
  if (!employeeData) return;

  const selectedArea = employeeData.area ?? areaId ?? null;
  const selectedSector = employeeData.sector ?? sectorDoc?._id ?? null;

  if (
    selectedArea &&
    sectorDoc &&
    sectorDoc.area?.toString() !== selectedArea.toString()
  ) {
    throw new ApiError(
      400,
      "Area, sector, and current location must belong to the same area",
    );
  }

  if (
    selectedSector &&
    locationDoc &&
    locationDoc.sector?.toString() !== selectedSector.toString()
  ) {
    throw new ApiError(
      400,
      "Area, sector, and current location must belong to the same area",
    );
  }
};

// Find an employee only inside the selected area.
// Returns 404 so employees in other areas are not revealed.
const findEmployeeInScope = async (id, areaScope, query = null) => {
  const scopedAreaId = getScopedAreaId(areaScope);

  const employee = await (query
    ? query(Employee.findOne({ _id: id, area: scopedAreaId }))
    : Employee.findOne({ _id: id, area: scopedAreaId }));

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  return employee;
};

// ======================================
// CREATE EMPLOYEE
// ======================================

export const createEmployeeService = async ({
  data,
  files,
  userId,
  areaScope = {},
}) => {
  const missingImageFields = getMissingEmployeeImageFields(files);
  if (missingImageFields.length) {
    throw new ApiError(
      400,
      `Required employee images are missing: ${missingImageFields.join(", ")}`,
    );
  }

  const normalized = normalizeEmployeeData(data);
  const {
    name,
    fatherName,
    birthDate,
    cnic,
    address,
    phone1,
    emergencyContacts,
    references,
    education,
    designation,
    monthlySalary,
    area,
    sector,
    status,
    entryDate,
    exitDate,
    notes,
    currentLocation,
    defaultShift,
  } = normalized;

  const scopedAreaId = getScopedAreaId(areaScope);

  // Body area (if sent) must match the selected area.
  if (
    area !== undefined &&
    area !== null &&
    area !== "" &&
    String(area) !== scopedAreaId
  ) {
    throw new ApiError(400, "Conflicting area selections");
  }

  const effectiveStatus = status || "active";

  if (!name || !fatherName || !birthDate || !cnic || !phone1 || !designation) {
    throw new ApiError(400, "Required fields are missing");
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
    throw new ApiError(
      400,
      "A valid monthlySalary is required to create an employee",
    );
  }

  // New employees always belong to the selected area.
  const validatedArea = await validateArea(scopedAreaId);

  const existing = await Employee.findOne({
    cnic: normalized.cnic,
  });

  if (existing) {
    throw new ApiError(409, "Employee with this CNIC already exists");
  }

  const validatedSector = await validateSector(sector, validatedArea);
  const validatedLocation = await validateLocation(
    currentLocation,
    validatedSector?._id ?? null,
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
            emergencyContacts,
            references,

            education,
            designation,

            area: validatedArea,
            sector: validatedSector?._id || null,

            status: effectiveStatus,
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

export const getEmployeesService = async (query = {}, areaScope = {}) => {
  const normalizeQueryValue = (value) => {
    if (typeof value !== "string") return undefined;

    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  };

  // Always limited to the single selected area.
  const scopedAreaId = getScopedAreaId(areaScope);

  const status = normalizeQueryValue(query.status);
  const designation = normalizeQueryValue(query.designation);
  const sector = normalizeQueryValue(query.sector);
  const education = normalizeQueryValue(query.education);
  const currentLocation = normalizeQueryValue(query.currentLocation);
  const search = normalizeQueryValue(query.search);
  const entryFrom = normalizeQueryValue(query.entryFrom);
  const entryTo = normalizeQueryValue(query.entryTo);
  const hasExited = normalizeQueryValue(query.hasExited);
  const defaultShift = normalizeQueryValue(query.defaultShift);
  const unassigned = normalizeQueryValue(query.unassigned);

  // The area itself is the scope, so it can't be "unassigned" inside it.
  if (unassigned === "area") {
    throw new ApiError(
      400,
      "Unassigned area filter is not available within a selected area.",
    );
  }

  const filter = { area: scopedAreaId };
  const andConditions = [];

  // STATUS
  if (status) {
    filter.status = status;
  }

  // DESIGNATION
  if (designation) {
    filter.designation = designation;
  }

  // SECTOR
  if (sector && unassigned !== "sector") {
    if (!mongoose.Types.ObjectId.isValid(sector)) {
      throw new ApiError(400, "Invalid sector.");
    }

    filter.sector = sector;
  }

  // DEFAULT SHIFT
  if (defaultShift) {
    filter.defaultShift = defaultShift;
  }

  // CURRENT LOCATION
  if (currentLocation && unassigned !== "currentLocation") {
    if (!mongoose.Types.ObjectId.isValid(currentLocation)) {
      throw new ApiError(400, "Invalid current location.");
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
        throw new ApiError(400, "Invalid entryFrom date.");
      }

      filter.entryDate.$gte = from;
    }

    if (entryTo) {
      const to = new Date(entryTo);

      if (Number.isNaN(to.getTime())) {
        throw new ApiError(400, "Invalid entryTo date.");
      }

      filter.entryDate.$lte = to;
    }

    if (
      filter.entryDate.$gte &&
      filter.entryDate.$lte &&
      filter.entryDate.$gte > filter.entryDate.$lte
    ) {
      throw new ApiError(400, "entryFrom must be before entryTo.");
    }
  }

  // EXIT STATUS
  if (hasExited === "true") {
    filter.exitDate = { $ne: null };
  }

  if (hasExited === "false") {
    filter.exitDate = null;
  }

  const finalFilter =
    andConditions.length === 0 ? filter : { $and: [filter, ...andConditions] };

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

export const lookupEmployeeService = async (empId, areaScope = {}) => {
  if (!empId || typeof empId !== "string" || !empId.trim()) {
    throw new ApiError(400, "Employee ID (empId) is required");
  }

  const scopedAreaId = getScopedAreaId(areaScope);

  const escaped = empId.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const employee = await Employee.findOne({
    area: scopedAreaId,
    empId: {
      $regex: `^${escaped}$`,
      $options: "i",
    },
  }).select("_id empId name fatherName designation status area");

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  return employee;
};

// ======================================
// GET SINGLE EMPLOYEE
// ======================================

export const getEmployeeByIdService = async (id, areaScope = {}) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid employee ID");
  }

  return findEmployeeInScope(id, areaScope, (q) =>
    q
      .populate("area", "name")
      .populate("currentLocation", "name")
      .populate("sector", "name"),
  );
};

// ======================================
// UPDATE EMPLOYEE
// ======================================

export const updateEmployeeService = async ({
  id,
  data,
  files,
  areaScope = {},
}) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid employee ID");
  }

  const employeeData = data ?? {};

  if (
    typeof employeeData !== "object" ||
    Array.isArray(employeeData)
  ) {
    throw new ApiError(400, "Employee update data must be an object");
  }

  // Employee must currently belong to the selected area.
  const employee = await findEmployeeInScope(id, areaScope);

  const normalized = normalizeEmployeeData(employeeData);

  // CNIC VALIDATION

  if (normalized.cnic) {
    const existing = await Employee.findOne({
      cnic: normalized.cnic,
      _id: { $ne: id },
    });

    if (existing) {
      throw new ApiError(409, "Another employee already uses this CNIC");
    }
  }

  // AREA / SECTOR / LOCATION VALIDATION
  // Only validated when one of them is being changed, so unrelated edits
  // don't fail on older records.

  const areaChanging = employeeData.area !== undefined;
  const sectorChanging = employeeData.sector !== undefined;
  const locationChanging = employeeData.currentLocation !== undefined;

  let targetArea = employee.area;
  let validatedSector = null;
  let validatedLocation = null;

  if (areaChanging || sectorChanging || locationChanging) {
    if (areaChanging) {
      const newArea = await validateArea(employeeData.area);

      // An employee cannot be left without an area.
      if (!newArea) {
        throw new ApiError(400, "Employee must have an area");
      }

      // Moving to another area requires access to that area.
      if (!canAccessArea(newArea, areaScope)) {
        throw new ApiError(403, "Unauthorized area access");
      }

      targetArea = newArea;
    }

    const sectorId = sectorChanging
      ? String(employeeData.sector ?? "").trim() || null
      : employee.sector;

    const locationId = locationChanging
      ? String(employeeData.currentLocation ?? "").trim() || null
      : employee.currentLocation;

    validatedSector = await validateSector(sectorId, targetArea);
    validatedLocation = await validateLocation(
      locationId,
      validatedSector?._id ?? null,
    );

    if (areaChanging) employee.area = targetArea;

    if (sectorChanging) employee.sector = validatedSector?._id ?? null;

    if (locationChanging) {
      employee.currentLocation = validatedLocation?._id ?? null;
    }
  }

  // ALLOWED FIELDS (area, sector and currentLocation are handled above)

  const allowedFields = [
    "name",
    "fatherName",
    "birthDate",
    "cnic",
    "address",
    "phone1",
    "emergencyContacts",
    "references",
    "education",
    "designation",
    "defaultShift",
    "status",
    "entryDate",
    "exitDate",
    "notes",
  ];

  const nullableFields = ["education", "defaultShift", "exitDate"];

  for (const field of allowedFields) {
    if (normalized[field] === undefined) continue;

    if (nullableFields.includes(field) && normalized[field] === "") {
      employee[field] = null;
      continue;
    }

    employee[field] = normalized[field];
  }

  if (
    employeeData.removeProfileImage === true ||
    employeeData.removeProfileImage === "true"
  ) {
    employee.profileImage = "";
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

export const deleteEmployeeService = async (id, areaScope = {}) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid employee ID");
  }

  const employee = await findEmployeeInScope(id, areaScope);

  await employee.deleteOne();

  return employee;
};
