import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import EmployeeSalary from "../models/EmployeeSalary.js";
import { getSalaryForPayrollMonth } from "../services/employeeSalary.service.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Create initial salary or a new salary record
 *
 * POST /api/employee-salaries
 *
 * Body:
 * {
 *   employee: "...",
 *   monthlySalary: 40000,
 *   effectiveFrom: "2026-08-01",
 *   reason: "initial_salary",
 *   notes: "Initial salary"
 * }
 */
export const createEmployeeSalary = async (req, res) => {
  try {
    const { employee, monthlySalary, effectiveFrom, reason, notes } = req.body;

    // Validate employee ID
    if (!employee || !isValidObjectId(employee)) {
      return res.status(400).json({
        success: false,
        message: "Valid employee ID is required",
      });
    }

    // Validate salary
    if (
      monthlySalary === undefined ||
      monthlySalary === null ||
      !Number.isFinite(Number(monthlySalary)) ||
      Number(monthlySalary) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Monthly salary must be a valid non-negative number",
      });
    }

    // Validate effective date
    const salaryEffectiveDate = new Date(effectiveFrom);

    if (!effectiveFrom || Number.isNaN(salaryEffectiveDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Valid effective date is required",
      });
    }

    // Salary changes are only allowed from the first day of a month
    if (salaryEffectiveDate.getUTCDate() !== 1) {
      return res.status(400).json({
        success: false,
        message: "Salary effective date must be the first day of a month",
      });
    }

    // Make sure employee exists
    const existingEmployee = await Employee.findById(employee);

    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    /*
     * Check whether a salary record already exists
     * for this employee and effective month.
     *
     * The unique index also protects against race conditions.
     */
    const existingSalary = await EmployeeSalary.findOne({
      employee,
      effectiveFrom: salaryEffectiveDate,
    });

    if (existingSalary) {
      return res.status(409).json({
        success: false,
        message: "A salary record already exists for this effective month",
      });
    }

    /*
     * If this is the first salary record for the employee,
     * reason should normally be initial_salary.
     */
    const salaryCount = await EmployeeSalary.countDocuments({
      employee,
    });

    if (salaryCount === 0 && reason && reason !== "initial_salary") {
      return res.status(400).json({
        success: false,
        message: "The first salary record must use initial_salary reason",
      });
    }

    /*
     * If salary history already exists, don't allow another
     * "initial_salary" record.
     */
    if (salaryCount > 0 && reason === "initial_salary") {
      return res.status(400).json({
        success: false,
        message:
          "initial_salary can only be used for the employee's first salary record",
      });
    }

    const salary = await EmployeeSalary.create({
      employee,
      monthlySalary: Number(monthlySalary),
      effectiveFrom: salaryEffectiveDate,
      reason: reason || (salaryCount === 0 ? "initial_salary" : "other"),
      notes: notes?.trim() || undefined,
      createdBy: req.user.id,
    });

    const populatedSalary = await EmployeeSalary.findById(salary._id)
      .populate("employee", "empId name fatherName designation")
      .populate("createdBy", "name userId");

    return res.status(201).json({
      success: true,
      message: "Employee salary created successfully",
      data: populatedSalary,
    });
  } catch (error) {
    // Handle duplicate unique index safely
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A salary record already exists for this employee and month",
      });
    }

    console.error("createEmployeeSalary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create employee salary",
      error: error.message,
    });
  }
};

/**
 * Get current salary
 *
 * GET /api/employee-salaries/:employeeId/current
 */
export const getCurrentEmployeeSalary = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!isValidObjectId(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const employee = await Employee.findById(employeeId).select(
      "_id empId name fatherName designation status",
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const currentDate = new Date();
    const salary = await getSalaryForPayrollMonth(
      employeeId,
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth() + 1,
    );

    if (salary) {
      const populatedSalary = await EmployeeSalary.findById(salary._id)
        .populate("createdBy", "name userId")
        .populate("updatedBy", "name userId");

      return res.status(200).json({
        success: true,
        data: {
          employee,
          salary: populatedSalary,
        },
      });
    }

    return res.status(404).json({
      success: false,
      message: "No salary record found for this employee",
    });
  } catch (error) {
    console.error("getCurrentEmployeeSalary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get current employee salary",
      error: error.message,
    });
  }
};

/**
 * Get complete salary history
 *
 * GET /api/employee-salaries/:employeeId/history
 */
export const getEmployeeSalaryHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!isValidObjectId(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const employee = await Employee.findById(employeeId).select(
      "_id empId name fatherName designation status",
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const salaryHistory = await EmployeeSalary.find({
      employee: employeeId,
    })
      .sort({ effectiveFrom: -1 })
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(200).json({
      success: true,
      count: salaryHistory.length,
      data: {
        employee,
        salaryHistory,
      },
    });
  } catch (error) {
    console.error("getEmployeeSalaryHistory error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get employee salary history",
      error: error.message,
    });
  }
};

/**
 * Update salary record
 *
 * PATCH /api/employee-salaries/:id
 *
 * IMPORTANT:
 * This should mainly be used for correcting an
 * unprocessed salary record.
 *
 * For an actual salary increase/decrease,
 * creating a NEW salary record is preferred.
 */
export const updateEmployeeSalary = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid salary record ID",
      });
    }

    const salary = await EmployeeSalary.findById(id);

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary record not found",
      });
    }

    const { monthlySalary, effectiveFrom, reason, notes } = req.body;

    /*
     * We allow correction of the salary amount,
     * but do not allow moving the record to another
     * employee through this endpoint.
     */

    if (monthlySalary !== undefined) {
      if (
        !Number.isFinite(Number(monthlySalary)) ||
        Number(monthlySalary) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Monthly salary must be a valid non-negative number",
        });
      }

      salary.monthlySalary = Number(monthlySalary);
    }

    if (effectiveFrom !== undefined) {
      const newEffectiveDate = new Date(effectiveFrom);

      if (Number.isNaN(newEffectiveDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid effective date",
        });
      }

      if (newEffectiveDate.getUTCDate() !== 1) {
        return res.status(400).json({
          success: false,
          message: "Salary effective date must be the first day of a month",
        });
      }

      salary.effectiveFrom = newEffectiveDate;
    }

    if (reason !== undefined) {
      const allowedReasons = [
        "initial_salary",
        "salary_increase",
        "salary_decrease",
        "promotion",
        "designation_change",
        "other",
      ];

      if (!allowedReasons.includes(reason)) {
        return res.status(400).json({
          success: false,
          message: "Invalid salary change reason",
        });
      }

      salary.reason = reason;
    }

    if (notes !== undefined) {
      salary.notes = notes?.trim() || undefined;
    }

    salary.updatedBy = req.user.id;

    await salary.save();

    const updatedSalary = await EmployeeSalary.findById(salary._id)
      .populate("employee", "empId name fatherName designation")
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(200).json({
      success: true,
      message: "Employee salary updated successfully",
      data: updatedSalary,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A salary record already exists for this employee and month",
      });
    }

    console.error("updateEmployeeSalary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update employee salary",
      error: error.message,
    });
  }
};
