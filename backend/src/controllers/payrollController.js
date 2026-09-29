import mongoose from "mongoose";

import Payroll from "../models/Payroll.js";
import ApiError from "../utils/ApiError.js";

import {
  getPayrollsService,
  getPayrollByIdService,
  getEmployeePayrollsService,
} from "../services/payroll/payrollQueryService.js";

import {
  finalizePayrollById,
  generatePayrollForEmployee,
  generatePayrollForMonth,
  markPayrollPaid,
} from "../services/payroll/payrollService.js";

const validatePeriod = (year, month) => {
  const parsedYear = Number(year);
  const parsedMonth = Number(month);

  if (!Number.isInteger(parsedYear) || parsedYear < 2000 || parsedYear > 2100) {
    throw new ApiError(400, "Invalid year");
  }

  if (!Number.isInteger(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
    throw new ApiError(400, "Invalid month");
  }

  return { year: parsedYear, month: parsedMonth };
};

/**
 * GET /api/payroll
 */
export const getPayrolls = async (req, res, next) => {
  try {
    const payrolls = await getPayrollsService(req.query, req.areaScope);

    return res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/payroll/:id
 */
export const getPayrollById = async (req, res, next) => {
  try {
    const payroll = await getPayrollByIdService(req.params.id, req.areaScope);

    return res.status(200).json({
      success: true,
      data: payroll,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/payroll/employee/:employeeId
 */
export const getEmployeePayrolls = async (req, res, next) => {
  try {
    const payrolls = await getEmployeePayrollsService(
      req.params.employeeId,
      req.areaScope,
    );

    return res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/payroll/generate
 */
export const generatePayroll = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId || !mongoose.isValidObjectId(employeeId)) {
      throw new ApiError(400, "Valid employeeId is required");
    }

    const { year, month } = validatePeriod(req.body.year, req.body.month);

    const payroll = await generatePayrollForEmployee({
      employeeId,
      year,
      month,
      userId: req.user.id,
      areaScope: req.areaScope,
    });

    return res.status(201).json({
      success: true,
      message: "Payroll generated successfully",
      data: payroll,
    });
  } catch (error) {
    if (
      error.code === 11000 ||
      error.message === "Payroll already exists for this employee and month"
    ) {
      return next(
        new ApiError(409, "Payroll already exists for this employee and month"),
      );
    }

    return next(error);
  }
};

/**
 * POST /api/payroll/generate-month
 */
export const generateMonthlyPayroll = async (req, res, next) => {
  try {
    const { year, month } = validatePeriod(req.body.year, req.body.month);

    const result = await generatePayrollForMonth({
      year,
      month,
      userId: req.user.id,
      areaScope: req.areaScope,
    });

    return res.status(201).json({
      success: true,
      message: "Monthly payroll generated successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/payroll/:id/recalculate
 */
export const recalculatePayroll = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, "Invalid payroll ID");
    }

    const payroll = await Payroll.findById(id);

    if (!payroll) {
      throw new ApiError(404, "Payroll not found");
    }

    if (payroll.status !== "draft") {
      throw new ApiError(400, "Only draft payroll can be recalculated");
    }

    const updatedPayroll = await generatePayrollForEmployee({
      employeeId: payroll.employee,
      year: payroll.year,
      month: payroll.month,
      userId: req.user.id,
      payrollId: payroll._id,
      recalculate: true,
      areaScope: req.areaScope,
    });

    return res.status(200).json({
      success: true,
      message: "Payroll recalculated successfully",
      data: updatedPayroll,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/payroll/recalculate-month
 */
export const recalculateMonthlyPayroll = async (req, res, next) => {
  try {
    const { year, month } = validatePeriod(req.body.year, req.body.month);

    const payrolls = await Payroll.find({
      year,
      month,
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
          areaScope: req.areaScope,
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
      message:
        `Monthly payroll recalculation completed. ` +
        `${recalculated} of ${payrolls.length} payrolls recalculated.`,
      data: {
        total: payrolls.length,
        recalculated,
        failed: errors.length,
        errors,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * PATCH /api/payroll/:id/finalize
 */
export const finalizePayroll = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, "Invalid payroll ID");
    }

    const payroll = await finalizePayrollById({
      payrollId: id,
      userId: req.user.id,
      areaScope: req.areaScope,
    });

    return res.status(200).json({
      success: true,
      message: "Payroll finalized successfully",
      data: payroll,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * PATCH /api/payroll/:id/pay
 */
export const markPayrollAsPaid = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentMethod, paymentReference } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, "Invalid payroll ID");
    }

    const payroll = await markPayrollPaid({
      payrollId: id,
      userId: req.user.id,
      paymentMethod,
      paymentReference,
      areaScope: req.areaScope,
    });

    return res.status(200).json({
      success: true,
      message: "Payroll marked as paid successfully",
      data: payroll,
    });
  } catch (error) {
    return next(error);
  }
};
