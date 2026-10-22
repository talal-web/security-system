// backend/http/routes/payrollRoutes.js

import express from "express";

import {
  getPayrolls,
  getPayrollById,
  getEmployeePayrolls,
  generatePayroll,
  recalculateMonthlyPayroll,
  generateMonthlyPayroll,
  recalculatePayroll,
  finalizePayroll,
  markPayrollAsPaid,
} from "../controllers/payrollController.js";

import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { requireAreaAccess } from "../middlewares/areaScopeMiddleware.js";
import { validate } from "../validators/validate.js";
import {
  generatePayrollSchema,
  payrollPeriodSchema,
  markPayrollPaidSchema,
} from "../validators/payrollSchemas.js";

const router = express.Router();

// Every payroll route is admin/developer only and scoped to one area.
router.use(authorizeRoles("developer", "admin"), requireAreaAccess);

// ============================================================================
// VIEW PAYROLL
// ============================================================================

// Get all payroll records with filters
router.get("/", getPayrolls);

// Get payrolls for a specific employee
router.get("/employee/:employeeId", getEmployeePayrolls);

// Get a single payroll record
router.get("/:id", getPayrollById);

// ============================================================================
// GENERATE / RECALCULATE PAYROLL
// ============================================================================

// Generate payroll for one employee
router.post("/generate", validate(generatePayrollSchema), generatePayroll);

// Generate payroll for all eligible employees for a month
router.post(
  "/generate-month",
  validate(payrollPeriodSchema),
  generateMonthlyPayroll,
);

// Recalculate all draft payrolls for a month
router.post(
  "/recalculate-month",
  validate(payrollPeriodSchema),
  recalculateMonthlyPayroll,
);

// Recalculate an existing draft payroll
router.post("/:id/recalculate", recalculatePayroll);

// ============================================================================
// FINALIZE / PAY
// ============================================================================

// Finalize a draft payroll
router.patch("/:id/finalize", finalizePayroll);

// Mark finalized payroll as paid
router.patch(
  "/:id/pay",
  validate(markPayrollPaidSchema),
  markPayrollAsPaid,
);

export default router;
