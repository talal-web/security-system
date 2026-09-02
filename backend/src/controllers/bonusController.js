import mongoose from "mongoose";

import Employee from "../models/Employee.js";
import Bonus from "../models/Bonus.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ======================================
// Create Bonus
// POST /api/bonuses
// ======================================

export const createBonus = async (req, res) => {
  try {
    const { employee, amount, bonusDate, reason } = req.body;

    // Validate employee
    if (!employee || !isValidObjectId(employee)) {
      return res.status(400).json({
        success: false,
        message: "Valid employee ID is required",
      });
    }

    // Validate amount
    const bonusAmount = Number(amount);

    if (
      amount === undefined ||
      amount === null ||
      !Number.isFinite(bonusAmount) ||
      !Number.isInteger(bonusAmount) ||
      bonusAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Bonus amount must be a valid whole number greater than 0",
      });
    }

    // Validate reason
    if (typeof reason !== "string" || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Bonus reason is required",
      });
    }

    // Validate date
    let parsedBonusDate = new Date();

    if (bonusDate !== undefined) {
      parsedBonusDate = new Date(bonusDate);

      if (Number.isNaN(parsedBonusDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid bonus date",
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

    // Only active employees can receive a new bonus
    if (existingEmployee.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Bonus can only be created for an active employee",
      });
    }

    const bonus = await Bonus.create({
      employee,
      amount: bonusAmount,
      bonusDate: parsedBonusDate,
      reason: reason.trim(),
      status: "pending",
      createdBy: req.user.id,
    });

    const populatedBonus = await Bonus.findById(bonus._id)
      .populate("employee", "empId name fatherName designation status")
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(201).json({
      success: true,
      message: "Bonus created successfully",
      data: populatedBonus,
    });
  } catch (error) {
    console.error("createBonus error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create bonus",
      error: error.message,
    });
  }
};

// ======================================
// Get All Bonuses
// GET /api/bonuses
// ======================================

export const getBonuses = async (req, res) => {
  try {
    const { employee, status, search, fromDate, toDate } = req.query;

    const filter = {};

    // ============================================================
    // Filter by employee
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
    // Filter by status
    // ============================================================

    if (status !== undefined) {
      const allowedStatuses = ["pending", "paid", "cancelled"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid bonus status",
        });
      }

      filter.status = status;
    }

    // ============================================================
    // Filter by bonus date
    // ============================================================

    if (fromDate !== undefined || toDate !== undefined) {
      filter.bonusDate = {};

      if (fromDate !== undefined) {
        const from = new Date(fromDate);

        if (Number.isNaN(from.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid from date",
          });
        }

        from.setHours(0, 0, 0, 0);

        filter.bonusDate.$gte = from;
      }

      if (toDate !== undefined) {
        const to = new Date(toDate);

        if (Number.isNaN(to.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid to date",
          });
        }

        to.setHours(23, 59, 59, 999);

        filter.bonusDate.$lte = to;
      }

      // Make sure the range is valid
      if (
        filter.bonusDate.$gte &&
        filter.bonusDate.$lte &&
        filter.bonusDate.$gte > filter.bonusDate.$lte
      ) {
        return res.status(400).json({
          success: false,
          message: "From date cannot be after to date",
        });
      }
    }

    // ============================================================
    // Search employee
    // ============================================================

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      const employees = await Employee.find({
        $or: [{ empId: searchRegex }, { name: searchRegex }],
      }).select("_id");

      const employeeIds = employees.map((emp) => emp._id);

      // If employee filter is already provided, combine both
      if (filter.employee) {
        const matchesEmployee = employeeIds.some(
          (id) => id.toString() === filter.employee.toString(),
        );

        if (!matchesEmployee) {
          filter.employee = {
            $in: [],
          };
        }
      } else {
        filter.employee = {
          $in: employeeIds,
        };
      }
    }

    // ============================================================
    // Query
    // ============================================================

    const bonuses = await Bonus.find(filter)
      .sort({
        bonusDate: -1,
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
      count: bonuses.length,
      data: bonuses,
    });
  } catch (error) {
    console.error("getBonuses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get bonuses",
      error: error.message,
    });
  }
};

// ======================================
// Get Employee Bonus History
// GET /api/bonuses/employee/:employeeId
// ======================================

export const getEmployeeBonuses = async (req, res) => {
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

    const bonuses = await Bonus.find({
      employee: employeeId,
    })
      .sort({
        bonusDate: -1,
        createdAt: -1,
      })
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(200).json({
      success: true,
      count: bonuses.length,
      data: {
        employee,
        bonuses,
      },
    });
  } catch (error) {
    console.error("getEmployeeBonuses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get employee bonuses",
      error: error.message,
    });
  }
};

// ======================================
// Update / Correct Bonus
// PATCH /api/bonuses/:id
// ======================================
//
// Only pending bonuses can be corrected.
// Status and audit fields are backend-controlled.
//

export const updateBonus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bonus ID",
      });
    }

    const bonus = await Bonus.findById(id);

    if (!bonus) {
      return res.status(404).json({
        success: false,
        message: "Bonus not found",
      });
    }

    // Paid/cancelled bonuses are locked
    if (bonus.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bonuses can be corrected",
      });
    }

    const { amount, bonusDate, reason } = req.body;

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
          message: "Bonus amount must be a valid whole number greater than 0",
        });
      }

      bonus.amount = newAmount;
    }

    // Update date
    if (bonusDate !== undefined) {
      const newDate = new Date(bonusDate);

      if (Number.isNaN(newDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid bonus date",
        });
      }

      bonus.bonusDate = newDate;
    }

    // Update reason
    if (reason !== undefined) {
      if (typeof reason !== "string" || !reason.trim()) {
        return res.status(400).json({
          success: false,
          message: "Bonus reason is required",
        });
      }

      bonus.reason = reason.trim();
    }

    bonus.updatedBy = req.user.id;

    await bonus.save();

    const updatedBonus = await Bonus.findById(bonus._id)
      .populate("employee", "empId name fatherName designation status")
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(200).json({
      success: true,
      message: "Bonus updated successfully",
      data: updatedBonus,
    });
  } catch (error) {
    console.error("updateBonus error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update bonus",
      error: error.message,
    });
  }
};

// ======================================
// Cancel Bonus
// PATCH /api/bonuses/:id/cancel
// ======================================

export const cancelBonus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bonus ID",
      });
    }

    const bonus = await Bonus.findById(id);

    if (!bonus) {
      return res.status(404).json({
        success: false,
        message: "Bonus not found",
      });
    }

    // Only pending bonuses can be cancelled
    if (bonus.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bonuses can be cancelled",
      });
    }

    bonus.status = "cancelled";
    bonus.updatedBy = req.user.id;

    await bonus.save();

    const cancelledBonus = await Bonus.findById(bonus._id)
      .populate("employee", "empId name fatherName designation status")
      .populate("createdBy", "name userId")
      .populate("updatedBy", "name userId");

    return res.status(200).json({
      success: true,
      message: "Bonus cancelled successfully",
      data: cancelledBonus,
    });
  } catch (error) {
    console.error("cancelBonus error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel bonus",
      error: error.message,
    });
  }
};
