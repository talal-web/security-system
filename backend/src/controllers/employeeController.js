import Employee from "../models/Employee.js";
import EmployeeSalary from "../models/EmployeeSalary.js";
import Location from "../models/Location.js";
import mongoose from "mongoose";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import generateEmpId from "../utils/generateEmpId.js";
import { normalizeCnic, normalizePhone } from "../utils/normalize.js";

// First day (UTC) of the month containing the given date.
const firstDayOfMonthUTC = (date) => {
  const d = new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
};

// ======================================
// CREATE EMPLOYEE
// ======================================

export const createEmployee = async (req, res, next) => {
  try {
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
      sector,
      status,
      entryDate,
      exitDate,
      notes,
      currentLocation,
      defaultShift,
    } = req.body;

    if (
      !name ||
      !fatherName ||
      !birthDate ||
      !cnic ||
      !phone1 ||
      !designation
    ) {
      res.status(400);
      throw new Error("Required fields are missing");
    }

    // =========================
    // Validate Initial Salary
    // =========================
    // EmployeeSalary is the source of truth for salary, so a valid
    // monthlySalary is required to create the initial salary record.
    const initialSalary = Number(monthlySalary);

    if (
      monthlySalary === undefined ||
      monthlySalary === null ||
      monthlySalary === "" ||
      !Number.isFinite(initialSalary) ||
      initialSalary < 0
    ) {
      res.status(400);
      throw new Error(
        "A valid monthlySalary is required to create an employee",
      );
    }

    // =========================
    // Normalize Data
    // =========================
    const cleanedCnic = normalizeCnic(cnic);
    const cleanedPhone1 = normalizePhone(phone1);
    const cleanedPhone2 = normalizePhone(phone2);

    // =========================
    // Check Duplicate CNIC
    // =========================
    const existing = await Employee.findOne({ cnic: cleanedCnic });

    if (existing) {
      res.status(400);
      throw new Error("Employee with this CNIC already exists");
    }

    // =========================
    // Generate Employee ID
    // =========================
    const empId = await generateEmpId();

    // =========================
    // Upload Images
    // =========================
    let profileImage = "";
    let cnicFrontImage = "";
    let cnicBackImage = "";

    if (req.files?.profileImage?.[0]) {
      const result = await uploadToCloudinary(req.files.profileImage[0].buffer);
      profileImage = result.secure_url;
    }

    if (req.files?.cnicFrontImage?.[0]) {
      const result = await uploadToCloudinary(
        req.files.cnicFrontImage[0].buffer,
      );
      cnicFrontImage = result.secure_url;
    }

    if (req.files?.cnicBackImage?.[0]) {
      const result = await uploadToCloudinary(
        req.files.cnicBackImage[0].buffer,
      );
      cnicBackImage = result.secure_url;
    }

    // =========================
    // Create Employee + Initial Salary (transactional)
    // =========================
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

              cnic: cleanedCnic,
              address,

              phone1: cleanedPhone1,
              phone2: cleanedPhone2,

              education,
              designation,

              reference,
              sector,

              status: status || "active",

              defaultShift: defaultShift || null,

              entryDate,
              exitDate,

              notes,

              profileImage,
              cnicFrontImage,
              cnicBackImage,

              ...(currentLocation?.trim() ? { currentLocation } : {}),
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
              createdBy: req.user.id,
            },
          ],
          { session },
        );

        employee = createdEmployee;
      });
    } finally {
      await session.endSession();
    }

    res.status(201).json({
      success: true,
      message: "Employee Created Successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployees = async (req, res, next) => {
  try {
    const normalizeQueryValue = (value) => {
      if (typeof value !== "string") return undefined;

      const trimmed = value.trim();
      return trimmed === "" ? undefined : trimmed;
    };

    const status = normalizeQueryValue(req.query.status);
    const designation = normalizeQueryValue(req.query.designation);
    const sector = normalizeQueryValue(req.query.sector);
    const education = normalizeQueryValue(req.query.education);
    const currentLocation = normalizeQueryValue(req.query.currentLocation);
    const search = normalizeQueryValue(req.query.search);
    const entryFrom = normalizeQueryValue(req.query.entryFrom);
    const entryTo = normalizeQueryValue(req.query.entryTo);
    const hasExited = normalizeQueryValue(req.query.hasExited);
    const defaultShift = normalizeQueryValue(req.query.defaultShift);
    const unassigned = normalizeQueryValue(req.query.unassigned);

    const filter = {};
    const andConditions = [];

    // ======================
    // STATUS
    // ======================

    if (status) {
      filter.status = status;
    }

    // ======================
    // DESIGNATION
    // ======================

    if (designation) {
      filter.designation = designation;
    }

    // ======================
    // SECTOR
    // ======================

    if (sector && unassigned !== "sector") {
      if (!mongoose.Types.ObjectId.isValid(sector)) {
        return res.status(400).json({
          success: false,
          message: "Invalid sector.",
        });
      }

      filter.sector = sector;
    }

    // ======================
    // DEFAULT SHIFT
    // ======================

    if (defaultShift) {
      filter.defaultShift = defaultShift;
    }

    // ======================
    // CURRENT LOCATION
    // ======================

    if (currentLocation) {
      filter.currentLocation = currentLocation;
    }

    // ======================
    // EDUCATION
    // ======================

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

    // ======================
    // ASSIGNMENT STATUS
    // ======================

    if (unassigned === "sector") {
      andConditions.push({
        $or: [{ sector: null }, { sector: { $exists: false } }],
      });
    }

    if (unassigned === "shift") {
      andConditions.push({
        $or: [
          { defaultShift: null },
          { defaultShift: "" },
          { defaultShift: { $exists: false } },
        ],
      });
    }

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

    // ======================
    // SEARCH
    // ======================

    if (search) {
      andConditions.push({
        $or: [
          { empId: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
      });
    }

    // ======================
    // ENTRY DATE RANGE
    // ======================

    if (entryFrom || entryTo) {
      filter.entryDate = {};

      if (entryFrom) {
        filter.entryDate.$gte = new Date(entryFrom);
      }

      if (entryTo) {
        filter.entryDate.$lte = new Date(entryTo);
      }
    }

    // ======================
    // EXIT STATUS
    // ======================

    if (hasExited === "true") {
      filter.exitDate = { $ne: null };
    }

    if (hasExited === "false") {
      filter.exitDate = null;
    }

    // ======================
    // COMBINE FILTERS
    // ======================

    if (andConditions.length > 0) {
      filter.$and = andConditions;
    }

    // ======================
    // QUERY
    // ======================

    const employees = await Employee.find(filter)
      .populate("sector", "name code")
      .populate("currentLocation", "name")
      .sort({ empId: 1 });

    return res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// LOOKUP EMPLOYEE BY EMPID
// ======================================

export const lookupEmployee = async (req, res, next) => {
  try {
    const { empId } = req.query;

    if (!empId || typeof empId !== "string" || !empId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Employee ID (empId) is required",
      });
    }

    const trimmedEmpId = empId.trim();
    const escaped = trimmedEmpId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const employee = await Employee.findOne({
      empId: { $regex: `^${escaped}$`, $options: "i" },
    }).select("_id empId name fatherName designation status");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// GET SINGLE EMPLOYEE
// ======================================

export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("currentLocation", "name")
      .populate("sector", "name");

    if (!employee) {
      res.status(404);
      throw new Error("Employee not found");
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// UPDATE EMPLOYEE
// ======================================

export const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      res.status(404);
      throw new Error("Employee not found");
    }

    // =========================
    // Normalize & Validate CNIC
    // =========================
    if (req.body.cnic) {
      const cleanedCnic = normalizeCnic(req.body.cnic);

      const existing = await Employee.findOne({
        cnic: cleanedCnic,
        _id: { $ne: req.params.id },
      });

      if (existing) {
        res.status(400);
        throw new Error("Another employee already uses this CNIC");
      }

      req.body.cnic = cleanedCnic;
    }

    // =========================
    // Normalize Phone Numbers
    // =========================
    if (req.body.phone1 !== undefined) {
      req.body.phone1 = normalizePhone(req.body.phone1);
    }

    if (req.body.phone2 !== undefined) {
      req.body.phone2 = normalizePhone(req.body.phone2);
    }

    // =========================
    // Update Fields
    // =========================
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
      "sector",
      "defaultShift",
      "status",
      "entryDate",
      "exitDate",
      "notes",
    ];

    const nullableFields = ["education", "sector", "defaultShift", "exitDate"];

    for (const field of allowedFields) {
      if (req.body[field] === undefined) continue;

      if (nullableFields.includes(field) && req.body[field] === "") {
        employee[field] = null;
        continue;
      }

      employee[field] = req.body[field];
    }

    // =========================
    // Current Location
    // =========================
    if (req.body.currentLocation !== undefined) {
      employee.currentLocation =
        String(req.body.currentLocation).trim() || null;
    }

    // =========================
    // Profile Image Update
    // =========================
    if (req.files?.profileImage?.[0]) {
      const result = await uploadToCloudinary(req.files.profileImage[0].buffer);
      employee.profileImage = result.secure_url;
    }

    if (req.files?.cnicFrontImage?.[0]) {
      const result = await uploadToCloudinary(
        req.files.cnicFrontImage[0].buffer,
      );
      employee.cnicFrontImage = result.secure_url;
    }

    if (req.files?.cnicBackImage?.[0]) {
      const result = await uploadToCloudinary(
        req.files.cnicBackImage[0].buffer,
      );
      employee.cnicBackImage = result.secure_url;
    }

    await employee.save();

    res.status(200).json({
      success: true,
      message: "Employee Updated Successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// DELETE EMPLOYEE
// ======================================

export const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      res.status(404);
      throw new Error("Employee not found");
    }

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: "Employee Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
