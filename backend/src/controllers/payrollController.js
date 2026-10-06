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

// enforceAreaScope has already validated exactly one area.
// Needed here because two handlers query Payroll directly.
const getAreaId = (req) => {
  const areaId = req.areaScope?.areaId;

  if (typeof areaId !== "string" || !mongoose.isValidObjectId(areaId)) {
    throw new ApiError(400, "Area selection is required");
  }

  return areaId;
};

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
export const getPayrolls = async (req, res) => {
  const payrolls = await getPayrollsService(req.query, req.areaScope);

  res.status(200).json({
    success: true,
    count: payrolls.length,
    data: payrolls,
  });
};

/**
 * GET /api/payroll/:id
 */
export const getPayrollById = async (req, res) => {
  const payroll = await getPayrollByIdService(req.params.id, req.areaScope);

  res.status(200).json({
    success: true,
    data: payroll,
  });
};

/**
 * GET /api/payroll/employee/:employeeId
 */
export const getEmployeePayrolls = async (req, res) => {
  const payrolls = await getEmployeePayrollsService(
    req.params.employeeId,
    req.areaScope,
  );

  res.status(200).json({
    success: true,
    count: payrolls.length,
    data: payrolls,
  });
};

/**
 * POST /api/payroll/generate
 */
export const generatePayroll = async (req, res) => {
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

  res.status(201).json({
    success: true,
    message: "Payroll generated successfully",
    data: payroll,
  });
};

/**
 * POST /api/payroll/generate-month
 */
export const generateMonthlyPayroll = async (req, res) => {
  const { year, month } = validatePeriod(req.body.year, req.body.month);

  const result = await generatePayrollForMonth({
    year,
    month,
    userId: req.user.id,
    areaScope: req.areaScope,
  });

  res.status(201).json({
    success: true,
    message: "Monthly payroll generated successfully",
    data: result,
  });
};

/**
 * POST /api/payroll/:id/recalculate
 */
export const recalculatePayroll = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid payroll ID");
  }

  // Scoped lookup: payrolls in other areas return 404.
  const payroll = await Payroll.findOne({
    _id: id,
    area: getAreaId(req),
  }).select("_id employee year month status");

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

  res.status(200).json({
    success: true,
    message: "Payroll recalculated successfully",
    data: updatedPayroll,
  });
};

/**
 * POST /api/payroll/recalculate-month
 */
export const recalculateMonthlyPayroll = async (req, res) => {
  const { year, month } = validatePeriod(req.body.year, req.body.month);

  // Only draft payrolls in the selected area.
  // Populate employee name so failed recalculations can identify
  // the employee in the response.
  const payrolls = await Payroll.find({
    area: getAreaId(req),
    year,
    month,
    status: "draft",
  })
    .select("_id employee year month")
    .populate("employee", "name");

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
        employeeId: payroll.employee._id,
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
      return;
    }

  const payroll = payrolls[index];

    errors.push({
      payrollId: payroll._id,
      employeeId: payroll.employee?._id,
      employeeName: payroll.employee?.name ?? "Unknown employee",
      // Only expected (ApiError) messages reach the client.
      message:
        result.reason instanceof ApiError
          ? result.reason.message
          : "Failed to recalculate payroll",
    });
  });

  res.status(200).json({
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
};

/**
 * PATCH /api/payroll/:id/finalize
 */
export const finalizePayroll = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid payroll ID");
  }

  const payroll = await finalizePayrollById({
    payrollId: id,
    userId: req.user.id,
    areaScope: req.areaScope,
  });

  res.status(200).json({
    success: true,
    message: "Payroll finalized successfully",
    data: payroll,
  });
};

/**
 * PATCH /api/payroll/:id/pay
 */
export const markPayrollAsPaid = async (req, res) => {
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

  res.status(200).json({
    success: true,
    message: "Payroll marked as paid successfully",
    data: payroll,
  });
};