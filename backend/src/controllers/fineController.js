import mongoose from "mongoose";

import Employee from "../models/Employee.js";
import Fine from "../models/Fine.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ======================================
// Create Fine
// POST /api/fines
// ======================================

export const createFine = async (req, res) => {
  try {
    const { employee, amount, fineDate, reason } = req.body;

    // Validate employee ID
    if (!employee || !isValidObjectId(employee)) {
      return res.status(400).json({
        success: false,
        message: "Valid employee ID is required",
      });
    }

    // Validate amount
    const fineAmount = Number(amount);

    if (
      amount === undefined ||
      amount === null ||
      !Number.isFinite(fineAmount) ||
      !Number.isInteger(fineAmount) ||
      fineAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Fine amount must be a valid whole number greater than 0",
      });
    }

    // Validate reason
    if (typeof reason !== "string" || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Fine reason is required",
      });
    }

    // Validate fine date if provided
    let parsedFineDate = new Date();

    if (fineDate !== undefined) {
      parsedFineDate = new Date(fineDate);

      if (Number.isNaN(parsedFineDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid fine date",
        });
      }
    }

    // Make sure employee exists
    const existingEmployee = await Employee.findById(employee).select(
      "_id empId name fatherName designation status",
    );

    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Only active employees can receive a new fine
    if (existingEmployee.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Fine can only be created for an active employee",
      });
    }

    const fine = await Fine.create({
      employee,
      amount: fineAmount,
      remainingAmount: fineAmount,
      fineDate: parsedFineDate,
      reason: reason.trim(),
      status: "pending",
      createdBy: req.user.id,
    });

    const populatedFine = await Fine.findById(fine._id)
      .populate("employee", "empId name fatherName designation status")
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(201).json({
      success: true,
      message: "Fine created successfully",
      data: populatedFine,
    });
  } catch (error) {
    console.error("createFine error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create fine",
      error: error.message,
    });
  }
};

// ======================================
// Get All Fines
// GET /api/fines
// ======================================

export const getFines = async (req, res) => {
  try {
    const { employee, status, fromDate, toDate, search } = req.query;

    const filter = {};

    // ============================================================
    // Employee
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
    // Status
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
          message: "Invalid fine status",
        });
      }

      filter.status = status;
    }

    // ============================================================
    // Date Range
    // ============================================================

    if (fromDate || toDate) {
      filter.fineDate = {};

      if (fromDate) {
        const startDate = new Date(`${fromDate}T00:00:00`);

        if (Number.isNaN(startDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid fromDate",
          });
        }

        filter.fineDate.$gte = startDate;
      }

      if (toDate) {
        const endDate = new Date(`${toDate}T23:59:59.999`);

        if (Number.isNaN(endDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid toDate",
          });
        }

        filter.fineDate.$lte = endDate;
      }
    } else {
      // ==========================================================
      // Default Date Range
      //
      // On/after 10th → current month's 10th to today
      // Before 10th   → previous month's 10th to today
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

      filter.fineDate = {
        $gte: defaultFromDate,
        $lte: today,
      };
    }

    // ============================================================
    // Search by Employee ID or Name
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

      const employeeIds = employees.map((employee) => employee._id);

      filter.employee = {
        $in: employeeIds,
      };
    }

    // ============================================================
    // Get Fines
    // ============================================================

    const fines = await Fine.find(filter)
      .sort({
        fineDate: -1,
        createdAt: -1,
      })
      .populate("employee", "empId name fatherName designation status")
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    // ============================================================
    // Response
    // ============================================================

    return res.status(200).json({
      success: true,
      count: fines.length,
      data: fines,
    });
  } catch (error) {
    console.error("getFines error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get fines",
      error: error.message,
    });
  }
};

// ======================================
// Get Employee Fine History
// GET /api/fines/employee/:employeeId
// ======================================

export const getEmployeeFines = async (req, res) => {
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

    const fines = await Fine.find({
      employee: employeeId,
    })
      .sort({
        fineDate: -1,
        createdAt: -1,
      })
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(200).json({
      success: true,
      count: fines.length,
      data: {
        employee,
        fines,
      },
    });
  } catch (error) {
    console.error("getEmployeeFines error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get employee fines",
      error: error.message,
    });
  }
};

// ======================================
// Update / Correct Fine
// PATCH /api/fines/:id
// ======================================
//
// Only pending fines can be corrected.
// remainingAmount and status are never accepted
// from the frontend.
//

export const updateFine = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid fine ID",
      });
    }

    const fine = await Fine.findById(id);

    if (!fine) {
      return res.status(404).json({
        success: false,
        message: "Fine not found",
      });
    }

    // Once deduction starts, the fine cannot be edited.
    if (fine.status !== "pending" || fine.remainingAmount !== fine.amount) {
      return res.status(400).json({
        success: false,
        message: "Only fines that have not been deducted can be corrected",
      });
    }

    const { amount, fineDate, reason } = req.body;

    if (amount !== undefined) {
      const newAmount = Number(amount);

      if (
        !Number.isFinite(newAmount) ||
        !Number.isInteger(newAmount) ||
        newAmount <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Fine amount must be a valid whole number greater than 0",
        });
      }

      fine.amount = newAmount;
      fine.remainingAmount = newAmount;
    }

    if (fineDate !== undefined) {
      const newFineDate = new Date(fineDate);

      if (Number.isNaN(newFineDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid fine date",
        });
      }

      fine.fineDate = newFineDate;
    }

    if (reason !== undefined) {
      if (typeof reason !== "string" || !reason.trim()) {
        return res.status(400).json({
          success: false,
          message: "Fine reason is required",
        });
      }

      fine.reason = reason.trim();
    }

    fine.updatedBy = req.user.id;

    await fine.save();

    const updatedFine = await Fine.findById(fine._id)
      .populate("employee", "empId name fatherName designation status")
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(200).json({
      success: true,
      message: "Fine updated successfully",
      data: updatedFine,
    });
  } catch (error) {
    console.error("updateFine error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update fine",
      error: error.message,
    });
  }
};

// ======================================
// Cancel Fine
// PATCH /api/fines/:id/cancel
// ======================================

export const cancelFine = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid fine ID",
      });
    }

    const fine = await Fine.findById(id);

    if (!fine) {
      return res.status(404).json({
        success: false,
        message: "Fine not found",
      });
    }

    // Cancellation is only allowed before deduction.
    if (fine.status !== "pending" || fine.remainingAmount !== fine.amount) {
      return res.status(400).json({
        success: false,
        message: "Only a fine with no deductions can be cancelled",
      });
    }

    fine.status = "cancelled";
    fine.updatedBy = req.user.id;

    await fine.save();

    const cancelledFine = await Fine.findById(fine._id)
      .populate("employee", "empId name fatherName designation status")
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(200).json({
      success: true,
      message: "Fine cancelled successfully",
      data: cancelledFine,
    });
  } catch (error) {
    console.error("cancelFine error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel fine",
      error: error.message,
    });
  }
};
