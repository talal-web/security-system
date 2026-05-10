import Employee from "../models/Employee.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

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
      reference,
      status,
      entryDate,
      exitDate,
      notes,
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

    const employee = await Employee.create({
      name,
      fatherName,
      birthDate,
      cnic: cleanedCnic,
      address,
      phone1,
      phone2,
      education,
      designation,
      reference,
      status: status || "active",
      entryDate,
      exitDate,
      notes,
      profileImage,
      cnicFrontImage,
      cnicBackImage,
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

// ======================================
// GET ALL EMPLOYEES
// ======================================

export const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });

    res.status(200).json({
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
    const employee = await Employee.findById(req.params.id);

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
      "status",
      "entryDate",
      "exitDate",
      "notes",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        employee[field] = req.body[field];
      }
    });

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
