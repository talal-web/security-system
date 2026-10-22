import express from "express";

import {
  createDeduction,
  getDeductions,
  getEmployeeDeductions,
  updateDeduction,
  cancelDeduction,
} from "../controllers/deductionController.js";

import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { requireAreaAccess } from "../middlewares/areaScopeMiddleware.js";
import { validate } from "../validators/validate.js";
import {
  createDeductionSchema,
  updateDeductionSchema,
} from "../validators/deductionSchemas.js";

const router = express.Router();

// Create deduction
router.post(
  "/",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  validate(createDeductionSchema),
  createDeduction,
);

// Get all deductions / filter by employee or status
router.get(
  "/",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  requireAreaAccess,
  getDeductions,
);

// Get employee deduction history
router.get(
  "/employee/:employeeId",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  requireAreaAccess,
  getEmployeeDeductions,
);

// Correct deduction before processing
router.patch(
  "/:id",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  validate(updateDeductionSchema),
  updateDeduction,
);

// Cancel deduction before processing
router.patch(
  "/:id/cancel",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  cancelDeduction,
);

export default router;
