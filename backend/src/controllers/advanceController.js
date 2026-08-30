import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import Advance from "../models/Advance.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ======================================
// Create Advance
// POST /api/advances
// ======================================

export const createAdvance = async (req, res) => {
  try {
    const { employee, amount, advanceDate, description } = req.body;

    // Validate employee ID
    if (!employee || !isValidObjectId(employee)) {
      return res.status(400).json({
        success: false,
        message: "Valid employee ID is required",
      });
    }

    // Validate amount
    const advanceAmount = Number(amount);

    if (
      amount === undefined ||
      amount === null ||
      !Number.isFinite(advanceAmount) ||
      advanceAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Advance amount must be greater than 0",
      });
    }

    // Validate advance date if provided
    let parsedAdvanceDate = new Date();

    if (advanceDate !== undefined) {
      parsedAdvanceDate = new Date(advanceDate);

      if (Number.isNaN(parsedAdvanceDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid advance date",
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

    const advance = await Advance.create({
      employee: employee,
      amount: advanceAmount,
      remainingAmount: advanceAmount,
      advanceDate: parsedAdvanceDate,
      description: description?.trim() || "",
      status: "active",
      createdBy: req.user.id,
    });

    const populatedAdvance = await Advance.findById(advance._id)
      .populate("employee", "empId name fatherName designation status")
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(201).json({
      success: true,
      message: "Advance created successfully",
      data: populatedAdvance,
    });
  } catch (error) {
    console.error("createAdvance error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create advance",
      error: error.message,
    });
  }
};

// ======================================
// Get All Advances
// GET /api/advances
// ======================================

export const getAdvances = async (req, res) => {
  try {
    const { employee, status, fromDate, toDate, search } = req.query;

    const filter = {};

    // Employee
    if (employee !== undefined) {
      if (!isValidObjectId(employee)) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID",
        });
      }

      filter.employee = employee;
    }

    // Status
    if (status !== undefined) {
      const allowedStatuses = [
        "active",
        "partially_deducted",
        "fully_deducted",
        "cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid advance status",
        });
      }

      filter.status = status;
    }

    // Date range
    if (fromDate || toDate) {
      filter.advanceDate = {};

      if (fromDate) {
        const startDate = new Date(`${fromDate}T00:00:00`);

        if (Number.isNaN(startDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid fromDate",
          });
        }

        filter.advanceDate.$gte = startDate;
      }

      if (toDate) {
        const endDate = new Date(`${toDate}T23:59:59.999`);

        if (Number.isNaN(endDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid toDate",
          });
        }

        filter.advanceDate.$lte = endDate;
      }
    } else {
      // Default range:
      // On/after 10th  → current month's 10th to today
      // Before 10th     → previous month's 10th to today
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

      filter.advanceDate = {
        $gte: defaultFromDate,
        $lte: today,
      };
    }

    // Search by employee ID or name
    if (search?.trim()) {
      const searchTerm = search.trim();

      const employees = await Employee.find({
        $or: [
          { empId: { $regex: searchTerm, $options: "i" } },
          { name: { $regex: searchTerm, $options: "i" } },
        ],
      }).select("_id");

      const employeeIds = employees.map((employee) => employee._id);

      filter.employee = {
        $in: employeeIds,
      };
    }

    const advances = await Advance.find(filter)
      .sort({ advanceDate: -1, createdAt: -1 })
      .populate("employee", "empId name fatherName designation status")
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(200).json({
      success: true,
      count: advances.length,
      data: advances,
    });
  } catch (error) {
    console.error("getAdvances error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get advances",
      error: error.message,
    });
  }
};

// ======================================
// Get Employee Advance History
// GET /api/advances/employee/:employeeId
// ======================================

export const getEmployeeAdvances = async (req, res) => {
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

    const advances = await Advance.find({
      employee: employeeId,
    })
      .sort({ advanceDate: -1, createdAt: -1 })
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(200).json({
      success: true,
      count: advances.length,
      data: {
        employee,
        advances,
      },
    });
  } catch (error) {
    console.error("getEmployeeAdvances error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get employee advances",
      error: error.message,
    });
  }
};

// ======================================
// Update Advance
// PATCH /api/advances/:id
// ======================================
//
// Allowed only before any deduction has happened.
// Frontend cannot update remainingAmount or status.
//

export const updateAdvance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid advance ID",
      });
    }

    const advance = await Advance.findById(id);

    if (!advance) {
      return res.status(404).json({
        success: false,
        message: "Advance not found",
      });
    }

    // Once deduction starts, basic details must be locked.
    if (
      advance.status !== "active" ||
      advance.remainingAmount !== advance.amount
    ) {
      return res.status(400).json({
        success: false,
        message: "Only advances that have not been deducted can be corrected",
      });
    }

    const { amount, advanceDate, description } = req.body;

    if (amount !== undefined) {
      const newAmount = Number(amount);

      if (!Number.isFinite(newAmount) || newAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Advance amount must be greater than 0",
        });
      }

      advance.amount = newAmount;
      advance.remainingAmount = newAmount;
    }

    if (advanceDate !== undefined) {
      const newDate = new Date(advanceDate);

      if (Number.isNaN(newDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid advance date",
        });
      }

      advance.advanceDate = newDate;
    }

    if (description !== undefined) {
      advance.description = description.trim();
    }

    advance.updatedBy = req.user.id;

    await advance.save();

    const updatedAdvance = await Advance.findById(advance._id)
      .populate("employee", "empId name fatherName designation status")
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(200).json({
      success: true,
      message: "Advance updated successfully",
      data: updatedAdvance,
    });
  } catch (error) {
    console.error("updateAdvance error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update advance",
      error: error.message,
    });
  }
};

// ======================================
// Cancel Advance
// PATCH /api/advances/:id/cancel
// ======================================

export const cancelAdvance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid advance ID",
      });
    }

    const advance = await Advance.findById(id);

    if (!advance) {
      return res.status(404).json({
        success: false,
        message: "Advance not found",
      });
    }

    // Cancellation is only allowed before any deduction.
    if (
      advance.status !== "active" ||
      advance.remainingAmount !== advance.amount
    ) {
      return res.status(400).json({
        success: false,
        message: "Only an advance with no deductions can be cancelled",
      });
    }

    advance.status = "cancelled";
    advance.updatedBy = req.user.id;

    await advance.save();

    const cancelledAdvance = await Advance.findById(advance._id)
      .populate("employee", "empId name fatherName designation status")
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(200).json({
      success: true,
      message: "Advance cancelled successfully",
      data: cancelledAdvance,
    });
  } catch (error) {
    console.error("cancelAdvance error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel advance",
      error: error.message,
    });
  }
};
