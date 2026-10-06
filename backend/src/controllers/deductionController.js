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

export const createDeduction = async (req, res) => {
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
};

// ======================================
// Get All Deductions
// GET /api/deductions
// ======================================

export const getDeductions = async (req, res) => {
  const deductions = await getDeductionsService(req.query, req.areaScope);

  return res.status(200).json({
    success: true,
    count: deductions.length,
    data: deductions,
  });
};

// ======================================
// Get Employee Deduction History
// GET /api/deductions/employee/:employeeId
// ======================================

export const getEmployeeDeductions = async (req, res) => {
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
};

// ======================================
// Update / Correct Deduction
// PATCH /api/deductions/:id
// ======================================

export const updateDeduction = async (req, res) => {
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
};

// ======================================
// Cancel Deduction
// PATCH /api/deductions/:id/cancel
// ======================================

export const cancelDeduction = async (req, res) => {
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
};
