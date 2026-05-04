// controllers/employeeController.js

import Employee from "../models/Employee.js";

// ======================================
// ======================================

// controllers/employeeController.js

// ======================================
// Create Employee
// ======================================

export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      age,
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
      cnicFrontImage,
      cnicBackImage,
      profileImage,
      notes,
    } = req.body;

    // ======================================
    // Basic Validation
    // ======================================

    if (!name || !fatherName || !cnic || !phone1) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // ======================================
    // Check Existing CNIC
    // ======================================

    const existingEmployee = await Employee.findOne({
      cnic,
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee with this CNIC already exists",
      });
    }

    // ======================================
    // Create Employee
    // ======================================

    const employee = await Employee.create({
      name,
      fatherName,
      age,
      cnic,
      address,
      phone1,
      phone2,
      education,
      designation,
      reference,
      status: status || "Active",
      entryDate,
      exitDate,
      cnicFrontImage,
      cnicBackImage,
      profileImage,
      notes,
    });

    // ======================================
    // Success Response
    // ======================================

    res.status(201).json({
      success: true,
      message: "Employee Created Successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Create Employee Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// ======================================
// Get All Employees
// ======================================

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Single Employee
// ======================================

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Employee
// ======================================

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Employee Updated Successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Employee
// ======================================

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: "Employee Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
