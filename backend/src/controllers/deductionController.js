import {
  createDeductionService,
  getDeductionsService,
  getEmployeeDeductionsService,
  updateDeductionService,
  cancelDeductionService,
} from "../services/deduction/deduction.service.js";

// ======================================
// Create Deduction
// POST /api/deductions
// ======================================

export const createDeduction = async (req, res, next) => {
  try {
    const deduction = await createDeductionService(
      req.body,
      req.user.id,
      req.areaScope,
    );

    return res.status(201).json({
      success: true,
      message: "Deduction created successfully",
      data: deduction,
    });
  } catch (error) {
    console.error("createDeduction error:", error);
    error.operationMessage = "Failed to create deduction";
    next(error);
  }
};

// ======================================
// Get All Deductions
// GET /api/deductions
// ======================================

export const getDeductions = async (req, res, next) => {
  try {
    const deductions = await getDeductionsService(req.query, req.areaScope);

    return res.status(200).json({
      success: true,
      count: deductions.length,
      data: deductions,
    });
  } catch (error) {
    console.error("getDeductions error:", error);
    error.operationMessage = "Failed to get deductions";
    next(error);
  }
};

// ======================================
// Get Employee Deduction History
// GET /api/deductions/employee/:employeeId
// ======================================

export const getEmployeeDeductions = async (req, res, next) => {
  try {
    const result = await getEmployeeDeductionsService(
      req.params.employeeId,
      req.areaScope,
    );

    return res.status(200).json({
      success: true,
      count: result.deductions.length,
      data: {
        employee: result.employee,
        deductions: result.deductions,
      },
    });
  } catch (error) {
    console.error("getEmployeeDeductions error:", error);
    error.operationMessage = "Failed to get employee deductions";
    next(error);
  }
};

// ======================================
// Update / Correct Deduction
// PATCH /api/deductions/:id
// ======================================

export const updateDeduction = async (req, res, next) => {
  try {
    const deduction = await updateDeductionService(
      req.params.id,
      req.body,
      req.user.id,
      req.areaScope,
    );

    return res.status(200).json({
      success: true,
      message: "Deduction updated successfully",
      data: deduction,
    });
  } catch (error) {
    console.error("updateDeduction error:", error);
    error.operationMessage = "Failed to update deduction";
    next(error);
  }
};

// ======================================
// Cancel Deduction
// PATCH /api/deductions/:id/cancel
// ======================================

export const cancelDeduction = async (req, res, next) => {
  try {
    const deduction = await cancelDeductionService(
      req.params.id,
      req.user.id,
      req.areaScope,
    );

    return res.status(200).json({
      success: true,
      message: "Deduction cancelled successfully",
      data: deduction,
    });
  } catch (error) {
    console.error("cancelDeduction error:", error);
    error.operationMessage = "Failed to cancel deduction";
    next(error);
  }
};
