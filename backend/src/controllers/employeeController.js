import Employee from "../models/Employee.js";
import Location from "../models/Location.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import generateEmpId from "../utils/generateEmpId.js";

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
      basicSalary,
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

    const cleanedCnic = cnic.replace(/-/g, "");

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
    // CREATE EMPLOYEE
    // =========================
    const employee = await Employee.create({
      empId,

      name,
      fatherName,
      birthDate,

      cnic: cleanedCnic,
      address,

      phone1,
      phone2,

      education,
      designation,

      basicSalary,
      reference,
      sector,

      status: status || "active",

      defaultShift: defaultShift || "null",

      entryDate,
      exitDate,

      notes,

      profileImage,
      cnicFrontImage,
      cnicBackImage,

      ...(currentLocation?.trim() ? { currentLocation } : {}),
    });

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
    const {
      status,
      designation,
      sector,
      education,
      currentLocation,
      search,
      entryFrom,
      entryTo,
      hasExited,
      basicSalary,
      defaultShift,
      unassigned,
    } = req.query;

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

    if (sector) {
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
        $or: [{ sector: null }, { sector: "" }, { sector: { $exists: false } }],
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
    // BASIC SALARY
    // ======================

    if (basicSalary) {
      filter.basicSalary = Number(basicSalary);
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
// GET SINGLE EMPLOYEE
// ======================================

export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      "currentLocation",
      "name",
    );

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
    // CNIC CHECK
    // =========================
    if (req.body.cnic) {
      const cleaned = req.body.cnic.replace(/-/g, "");

      const existing = await Employee.findOne({
        cnic: cleaned,
        _id: { $ne: req.params.id },
      });

      if (existing) {
        res.status(400);
        throw new Error("Another employee already uses this CNIC");
      }

      req.body.cnic = cleaned;
    }

    // =========================
    // UPDATE FIELDS
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
      "basicSalary",
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

      if (field === "basicSalary") {
        employee[field] = Number(req.body[field]) || 0;
        continue;
      }

      employee[field] = req.body[field];
    }

    if (req.body.currentLocation !== undefined) {
      employee.currentLocation =
        String(req.body.currentLocation).trim() || null;
    }

    // =========================
    // PROFILE IMAGE UPDATE
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
