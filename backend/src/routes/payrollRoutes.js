// backend/src/routes/payrollRoutes.js

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

import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { requireAreaAccess } from "../middleware/areaScopeMiddleware.js";

const router = express.Router();

// ============================================================================
// VIEW PAYROLL
// ============================================================================

// Get all payroll records with filters
router.get(
  "/",
  authorizeRoles("developer", "admin"),
  requireAreaAccess,
  getPayrolls,
);

// Get payrolls for a specific employee
router.get(
  "/employee/:employeeId",
  authorizeRoles("developer", "admin"),
  requireAreaAccess,
  getEmployeePayrolls,
);

// Get a single payroll record
router.get(
  "/:id",
  authorizeRoles("developer", "admin"),
  requireAreaAccess,
  getPayrollById,
);

// ============================================================================
// GENERATE PAYROLL
// ============================================================================

// Generate payroll for one employee
router.post(
  "/generate",
  authorizeRoles("developer", "admin"),
  requireAreaAccess,
  generatePayroll,
);

// Generate payroll for all eligible employees for a month
router.post(
  "/generate-month",
  authorizeRoles("developer", "admin"),
  requireAreaAccess,
  generateMonthlyPayroll,
);

router.post("/recalculate-month", recalculateMonthlyPayroll);

// Recalculate an existing draft payroll
router.post(
  "/:id/recalculate",
  authorizeRoles("developer", "admin"),
  recalculatePayroll,
);

// ============================================================================
// FINALIZE PAYROLL
// ============================================================================

// Finalize a draft payroll
router.patch(
  "/:id/finalize",
  authorizeRoles("developer", "admin"),
  finalizePayroll,
);

// ============================================================================
// MARK PAYROLL AS PAID
// ============================================================================

// Mark finalized payroll as paid
router.patch(
  "/:id/pay",
  authorizeRoles("developer", "admin"),
  markPayrollAsPaid,
);

export default router;
