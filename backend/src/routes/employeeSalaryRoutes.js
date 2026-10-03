import express from "express";

import {
  createEmployeeSalary,
  getCurrentEmployeeSalary,
  getEmployeeSalaryHistory,
  updateEmployeeSalary,
} from "../controllers/employeeSalaryController.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { requireAreaAccess } from "../middleware/areaScopeMiddleware.js";

const router = express.Router();

// Create initial salary or a new salary record
router.post(
  "/",
  authorizeRoles("developer", "admin"),
  requireAreaAccess,
  createEmployeeSalary,
);

// Get current applicable salary for an employee
router.get(
  "/:employeeId/current",
  authorizeRoles("developer", "admin"),
  requireAreaAccess,
  getCurrentEmployeeSalary,
);

// Get complete salary history for an employee
router.get(
  "/:employeeId/history",
  authorizeRoles("developer", "admin"),
  requireAreaAccess,
  getEmployeeSalaryHistory,
);

// Update an existing salary record
router.patch(
  "/:id",
  authorizeRoles("developer", "admin"),
  requireAreaAccess,
  updateEmployeeSalary,
);

export default router;
