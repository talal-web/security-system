// backend/src/controllers/payrollController.js

import mongoose from "mongoose";

import Payroll from "../models/Payroll.js";
import Employee from "../models/Employee.js";
import {
  finalizePayrollById,
  generatePayrollForEmployee,
  generatePayrollForMonth,
  markPayrollPaid,
} from "../services/payrollService.js";

/**
 * GET /api/payroll
 *
 * Optional query:
 * ?year=2026&month=9&employee=EMPLOYEE_ID&status=draft
 */

export const getPayrolls = async (req, res) => {
  try {
    const { year, month, employee, status, search } = req.query;

    const filter = {};

    // ==========================================================================
    // YEAR
    // ==========================================================================

    if (year !== undefined) {
      const parsedYear = Number(year);

      if (
        !Number.isInteger(parsedYear) ||
        parsedYear < 2000 ||
        parsedYear > 2100
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid year",
        });
      }

      filter.year = parsedYear;
    }

    // ==========================================================================
    // MONTH
    // ==========================================================================

    if (month !== undefined) {
      const parsedMonth = Number(month);

      if (
        !Number.isInteger(parsedMonth) ||
        parsedMonth < 1 ||
        parsedMonth > 12
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid month",
        });
      }

      filter.month = parsedMonth;
    }

    // ==========================================================================
    // EMPLOYEE ID
    // ==========================================================================

    if (employee !== undefined) {
      if (!mongoose.isValidObjectId(employee)) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID",
        });
      }

      filter.employee = employee;
    }

    // ==========================================================================
    // STATUS
    // ==========================================================================

    if (status !== undefined && status !== "all") {
      const allowedStatuses = ["draft", "finalized", "paid"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payroll status",
        });
      }

      filter.status = status;
    }

    // ==========================================================================
    // EMPLOYEE SEARCH
    // Search by employee name OR empId
    // ==========================================================================

    if (search?.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      const matchingEmployees = await Employee.find({
        $or: [{ name: searchRegex }, { empId: searchRegex }],
      })
        .select("_id")
        .lean();

      const employeeIds = matchingEmployees.map((item) => item._id);

      if (employeeIds.length === 0) {
        return res.status(200).json({
          success: true,
          count: 0,
          data: [],
        });
      }

      if (filter.employee) {
        const matchesSelectedEmployee = employeeIds.some(
          (id) => String(id) === String(filter.employee),
        );

        if (!matchesSelectedEmployee) {
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

    // ==========================================================================
    // FETCH PAYROLLS
    // ==========================================================================

    const payrolls = await Payroll.find(filter)
      .populate("employee", "empId name fatherName designation status")
      .populate("finalizedBy", "userId name role")
      .populate("paidBy", "userId name role")
      .lean();

    // ==========================================================================
    // SORT BY EMPLOYEE ID
    // Natural sorting: EMP-1, EMP-2, EMP-10
    // ==========================================================================

    payrolls.sort((a, b) =>
      String(a.employee?.empId ?? "").localeCompare(
        String(b.employee?.empId ?? ""),
        undefined,
        {
          numeric: true,
          sensitivity: "base",
        },
      ),
    );

    return res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls,
    });
  } catch (error) {
    console.error("getPayrolls error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payrolls",
      error: error.message,
    });
  }
};

/**
 * GET /api/payroll/:id
 */
export const getPayrollById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payroll ID",
      });
    }

    const payroll = await Payroll.findById(id)
      .populate(
        "employee",
        "empId name fatherName designation status entryDate exitDate",
      )
      .populate("finalizedBy", "userId role")
      .populate("paidBy", "userId role");

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: payroll,
    });
  } catch (error) {
    console.error("getPayrollById error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payroll",
      error: error.message,
    });
  }
};

/**
 * GET /api/payroll/employee/:employeeId
 */
export const getEmployeePayrolls = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!mongoose.isValidObjectId(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const payrolls = await Payroll.find({
      employee: employeeId,
    })
      .sort({ year: -1, month: -1 })
      .populate("employee", "empId name fatherName designation status")
      .populate("finalizedBy", "userId name role")
      .populate("paidBy", "userId name role");

    return res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls,
    });
  } catch (error) {
    console.error("getEmployeePayrolls error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employee payroll history",
      error: error.message,
    });
  }
};

/**
 * POST /api/payroll/generate
 *
 * Generate payroll for one employee.
 *
 * Body:
 * {
 *   employeeId,
 *   year,
 *   month
 * }
 */
export const generatePayroll = async (req, res) => {
  try {
    const { employeeId, year, month } = req.body;

    if (!employeeId || !mongoose.isValidObjectId(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Valid employeeId is required",
      });
    }

    const parsedYear = Number(year);
    const parsedMonth = Number(month);

    if (
      !Number.isInteger(parsedYear) ||
      parsedYear < 2000 ||
      parsedYear > 2100
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid year",
      });
    }

    if (!Number.isInteger(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({
        success: false,
        message: "Invalid month",
      });
    }

    const employee = await Employee.findById(employeeId).select(
      "_id empId name status entryDate exitDate",
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const payroll = await generatePayrollForEmployee({
      employeeId,
      year: parsedYear,
      month: parsedMonth,
      userId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Payroll generated successfully",
      data: payroll,
    });
  } catch (error) {
    console.error("generatePayroll error:", error);

    if (
      error.code === 11000 ||
      error.message === "Payroll already exists for this employee and month"
    ) {
      return res.status(409).json({
        success: false,
        message: "Payroll already exists for this employee and month",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate payroll",
    });
  }
};

/**
 * POST /api/payroll/generate-month
 *
 * Generate payroll for all eligible employees.
 *
 * Body:
 * {
 *   year,
 *   month
 * }
 */
export const generateMonthlyPayroll = async (req, res) => {
  try {
    const parsedYear = Number(req.body.year);
    const parsedMonth = Number(req.body.month);

    if (
      !Number.isInteger(parsedYear) ||
      parsedYear < 2000 ||
      parsedYear > 2100
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid year",
      });
    }

    if (!Number.isInteger(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({
        success: false,
        message: "Invalid month",
      });
    }

    const result = await generatePayrollForMonth({
      year: parsedYear,
      month: parsedMonth,
      userId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Monthly payroll generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("generateMonthlyPayroll error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate monthly payroll",
    });
  }
};

/**
 * POST /api/payroll/:id/recalculate
 *
 * Only draft payroll can be recalculated.
 */
export const recalculatePayroll = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payroll ID",
      });
    }

    const payroll = await Payroll.findById(id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    if (payroll.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft payroll can be recalculated",
      });
    }

    const updatedPayroll = await generatePayrollForEmployee({
      employeeId: payroll.employee,
      year: payroll.year,
      month: payroll.month,
      userId: req.user.id,
      payrollId: payroll._id,
      recalculate: true,
    });

    return res.status(200).json({
      success: true,
      message: "Payroll recalculated successfully",
      data: updatedPayroll,
    });
  } catch (error) {
    console.error("recalculatePayroll error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to recalculate payroll",
    });
  }
};

/**
 * POST /api/payroll/recalculate-month
 *
 * Recalculate all existing draft payrolls for a month.
 *
 * Body:
 * {
 *   year,
 *   month
 * }
 */
export const recalculateMonthlyPayroll = async (req, res) => {
  try {
    const parsedYear = Number(req.body.year);
    const parsedMonth = Number(req.body.month);

    if (
      !Number.isInteger(parsedYear) ||
      parsedYear < 2000 ||
      parsedYear > 2100
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid year",
      });
    }

    if (!Number.isInteger(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({
        success: false,
        message: "Invalid month",
      });
    }

    const payrolls = await Payroll.find({
      year: parsedYear,
      month: parsedMonth,
      status: "draft",
    }).select("_id employee year month");

    if (payrolls.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No draft payrolls found to recalculate",
        data: {
          total: 0,
          recalculated: 0,
          failed: 0,
          errors: [],
        },
      });
    }

    const results = await Promise.allSettled(
      payrolls.map((payroll) =>
        generatePayrollForEmployee({
          employeeId: payroll.employee,
          year: payroll.year,
          month: payroll.month,
          userId: req.user.id,
          payrollId: payroll._id,
          recalculate: true,
        }),
      ),
    );

    const errors = [];
    let recalculated = 0;

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        recalculated += 1;
      } else {
        errors.push({
          payrollId: payrolls[index]._id,
          employeeId: payrolls[index].employee,
          message: result.reason?.message || "Failed to recalculate payroll",
        });
      }
    });

    return res.status(200).json({
      success: true,
      message: `Monthly payroll recalculation completed. ${recalculated} of ${payrolls.length} payrolls recalculated.`,
      data: {
        total: payrolls.length,
        recalculated,
        failed: errors.length,
        errors,
      },
    });
  } catch (error) {
    console.error("recalculateMonthlyPayroll error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to recalculate monthly payroll",
    });
  }
};

/**
 * PATCH /api/payroll/:id/finalize
 */
export const finalizePayroll = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payroll ID",
      });
    }

    const payroll = await finalizePayrollById({
      payrollId: id,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Payroll finalized successfully",
      data: payroll,
    });
  } catch (error) {
    console.error("finalizePayroll error:", error);

    return res.status(error.message === "Payroll not found" ? 404 : 400).json({
      success: false,
      message: error.message || "Failed to finalize payroll",
    });
  }
};

/**
 * PATCH /api/payroll/:id/pay
 */
export const markPayrollAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, paymentReference } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payroll ID",
      });
    }

    const payroll = await markPayrollPaid({
      payrollId: id,
      userId: req.user.id,
      paymentMethod,
      paymentReference,
    });

    return res.status(200).json({
      success: true,
      message: "Payroll marked as paid successfully",
      data: payroll,
    });
  } catch (error) {
    console.error("markPayrollAsPaid error:", error);

    return res.status(error.message === "Payroll not found" ? 404 : 400).json({
      success: false,
      message: error.message || "Failed to mark payroll as paid",
    });
  }
};
