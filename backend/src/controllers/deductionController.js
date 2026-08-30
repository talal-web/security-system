import mongoose from "mongoose";

import Employee from "../models/Employee.js";
import Deduction from "../models/Deduction.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ======================================
// Create Deduction
// POST /api/deductions
// ======================================

export const createDeduction = async (req, res) => {
  try {
    const { employee, amount, deductionDate, reason } = req.body;

    // Validate employee ID
    if (!employee || !isValidObjectId(employee)) {
      return res.status(400).json({
        success: false,
        message: "Valid employee ID is required",
      });
    }

    // Validate amount
    const deductionAmount = Number(amount);

    if (
      amount === undefined ||
      amount === null ||
      !Number.isFinite(deductionAmount) ||
      !Number.isInteger(deductionAmount) ||
      deductionAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Deduction amount must be a valid whole number greater than 0",
      });
    }

    // Validate reason
    if (typeof reason !== "string" || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Deduction reason is required",
      });
    }

    // Validate date
    let parsedDeductionDate = new Date();

    if (deductionDate !== undefined) {
      parsedDeductionDate = new Date(deductionDate);

      if (Number.isNaN(parsedDeductionDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid deduction date",
        });
      }
    }

    // Verify employee
    const existingEmployee = await Employee.findById(employee).select(
      "_id empId name fatherName designation status",
    );

    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Only active employees can receive a new deduction
    if (existingEmployee.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Deduction can only be created for an active employee",
      });
    }

    const deduction = await Deduction.create({
      employee,
      amount: deductionAmount,
      remainingAmount: deductionAmount,
      deductionDate: parsedDeductionDate,
      reason: reason.trim(),
      status: "pending",
      createdBy: req.user.id,
    });

    const populatedDeduction = await Deduction.findById(deduction._id)
      .populate("employee", "empId name fatherName designation status")
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(201).json({
      success: true,
      message: "Deduction created successfully",
      data: populatedDeduction,
    });
  } catch (error) {
    console.error("createDeduction error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create deduction",
      error: error.message,
    });
  }
};

// ======================================
// Get All Deductions
// GET /api/deductions
// ======================================

export const getDeductions = async (req, res) => {
  try {
    const { employee, status, fromDate, toDate, search } = req.query;

    const filter = {};

    // ============================================================
    // Employee Filter
    // ============================================================

    if (employee !== undefined) {
      if (!isValidObjectId(employee)) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID",
        });
      }

      filter.employee = employee;
    }

    // ============================================================
    // Status Filter
    // ============================================================

    if (status !== undefined) {
      const allowedStatuses = [
        "pending",
        "partially_deducted",
        "fully_deducted",
        "cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid deduction status",
        });
      }

      filter.status = status;
    }

    // ============================================================
    // Date Filter
    // ============================================================

    if (fromDate || toDate) {
      filter.deductionDate = {};

      // From Date
      if (fromDate) {
        const startDate = new Date(`${fromDate}T00:00:00`);

        if (Number.isNaN(startDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid fromDate",
          });
        }

        filter.deductionDate.$gte = startDate;
      }

      // To Date
      if (toDate) {
        const endDate = new Date(`${toDate}T23:59:59.999`);

        if (Number.isNaN(endDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid toDate",
          });
        }

        filter.deductionDate.$lte = endDate;
      }
    } else {
      // ==========================================================
      // Default Date Range
      //
      // 10th or later:
      // current month 10th → today
      //
      // Before 10th:
      // previous month 10th → today
      // ==========================================================

      const today = new Date();

      const fromMonth =
        today.getDate() >= 10 ? today.getMonth() : today.getMonth() - 1;

      const defaultFromDate = new Date(
        today.getFullYear(),
        fromMonth,
        10,
        0,
        0,
        0,
        0,
      );

      filter.deductionDate = {
        $gte: defaultFromDate,
        $lte: today,
      };
    }

    // ============================================================
    // Search Employee
    // ============================================================

    if (search?.trim()) {
      const searchTerm = search.trim();

      const employees = await Employee.find({
        $or: [
          {
            empId: {
              $regex: searchTerm,
              $options: "i",
            },
          },
          {
            name: {
              $regex: searchTerm,
              $options: "i",
            },
          },
        ],
      }).select("_id");

      const employeeIds = employees.map((item) => item._id);

      // No employees found
      if (employeeIds.length === 0) {
        return res.status(200).json({
          success: true,
          count: 0,
          data: [],
        });
      }

      // If employee filter already exists,
      // both employee and search must match.
      if (filter.employee) {
        const matchesEmployee = employeeIds.some(
          (id) => id.toString() === filter.employee.toString(),
        );

        if (!matchesEmployee) {
          return res.status(200).json({
            success: true,
            count: 0,
            data: [],
          });
        }
      } else {
        filter.employee = {
          $in: employeeIds,
        };
      }
    }

    // ============================================================
    // Get Deductions
    // ============================================================

    const deductions = await Deduction.find(filter)
      .sort({
        deductionDate: -1,
        createdAt: -1,
      })
      .populate("employee", "empId name fatherName designation status")
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId")
      .lean();

    // ============================================================
    // Response
    // ============================================================

    return res.status(200).json({
      success: true,
      count: deductions.length,
      data: deductions,
    });
  } catch (error) {
    console.error("getDeductions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get deductions",
      error: error.message,
    });
  }
};

// ======================================
// Get Employee Deduction History
// GET /api/deductions/employee/:employeeId
// ======================================

export const getEmployeeDeductions = async (req, res) => {
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

    const deductions = await Deduction.find({
      employee: employeeId,
    })
      .sort({
        deductionDate: -1,
        createdAt: -1,
      })
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(200).json({
      success: true,
      count: deductions.length,
      data: {
        employee,
        deductions,
      },
    });
  } catch (error) {
    console.error("getEmployeeDeductions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get employee deductions",
      error: error.message,
    });
  }
};

// ======================================
// Update / Correct Deduction
// PATCH /api/deductions/:id
// ======================================
//
// Only pending deductions can be corrected.
// remainingAmount and status are never accepted.
//

export const updateDeduction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid deduction ID",
      });
    }

    const deduction = await Deduction.findById(id);

    if (!deduction) {
      return res.status(404).json({
        success: false,
        message: "Deduction not found",
      });
    }

    // Once deduction starts, lock the record
    if (
      deduction.status !== "pending" ||
      deduction.remainingAmount !== deduction.amount
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only deductions that have not been processed can be corrected",
      });
    }

    const { amount, deductionDate, reason } = req.body;

    // Update amount
    if (amount !== undefined) {
      const newAmount = Number(amount);

      if (
        !Number.isFinite(newAmount) ||
        !Number.isInteger(newAmount) ||
        newAmount <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Deduction amount must be a valid whole number greater than 0",
        });
      }

      deduction.amount = newAmount;
      deduction.remainingAmount = newAmount;
    }

    // Update date
    if (deductionDate !== undefined) {
      const newDate = new Date(deductionDate);

      if (Number.isNaN(newDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid deduction date",
        });
      }

      deduction.deductionDate = newDate;
    }

    // Update reason
    if (reason !== undefined) {
      if (typeof reason !== "string" || !reason.trim()) {
        return res.status(400).json({
          success: false,
          message: "Deduction reason is required",
        });
      }

      deduction.reason = reason.trim();
    }

    deduction.updatedBy = req.user.id;

    await deduction.save();

    const updatedDeduction = await Deduction.findById(deduction._id)
      .populate("employee", "empId name fatherName designation status")
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(200).json({
      success: true,
      message: "Deduction updated successfully",
      data: updatedDeduction,
    });
  } catch (error) {
    console.error("updateDeduction error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update deduction",
      error: error.message,
    });
  }
};

// ======================================
// Cancel Deduction
// PATCH /api/deductions/:id/cancel
// ======================================

export const cancelDeduction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid deduction ID",
      });
    }

    const deduction = await Deduction.findById(id);

    if (!deduction) {
      return res.status(404).json({
        success: false,
        message: "Deduction not found",
      });
    }

    // Only cancel before any deduction
    if (
      deduction.status !== "pending" ||
      deduction.remainingAmount !== deduction.amount
    ) {
      return res.status(400).json({
        success: false,
        message: "Only a deduction with no processed amount can be cancelled",
      });
    }

    deduction.status = "cancelled";
    deduction.updatedBy = req.user.id;

    await deduction.save();

    const cancelledDeduction = await Deduction.findById(deduction._id)
      .populate("employee", "empId name fatherName designation status")
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(200).json({
      success: true,
      message: "Deduction cancelled successfully",
      data: cancelledDeduction,
    });
  } catch (error) {
    console.error("cancelDeduction error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel deduction",
      error: error.message,
    });
  }
};
