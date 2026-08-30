import express from "express";

import {
  createDeduction,
  getDeductions,
  getEmployeeDeductions,
  updateDeduction,
  cancelDeduction,
} from "../controllers/deductionController.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create deduction
router.post(
  "/",
  authorizeRoles("developer", "admin", "clerk"),
  createDeduction,
);

// Get all deductions / filter by employee or status
router.get(
  "/",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  getDeductions,
);

// Get employee deduction history
router.get(
  "/employee/:employeeId",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  getEmployeeDeductions,
);

// Correct deduction before processing
router.patch(
  "/:id",
  authorizeRoles("developer", "admin", "clerk"),
  updateDeduction,
);

// Cancel deduction before processing
router.patch(
  "/:id/cancel",
  authorizeRoles("developer", "admin", "clerk"),
  cancelDeduction,
);

export default router;
