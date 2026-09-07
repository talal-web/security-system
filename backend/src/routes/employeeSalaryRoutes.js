import express from "express";

import {
  createEmployeeSalary,
  getCurrentEmployeeSalary,
  getEmployeeSalaryHistory,
  updateEmployeeSalary,
} from "../controllers/employeeSalaryController.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create initial salary or a new salary record
router.post("/", authorizeRoles("developer", "admin"), createEmployeeSalary);

// Get current applicable salary for an employee
router.get(
  "/:employeeId/current",
  authorizeRoles("developer", "admin"),
  getCurrentEmployeeSalary,
);

// Get complete salary history for an employee
router.get(
  "/:employeeId/history",
  authorizeRoles("developer", "admin"),
  getEmployeeSalaryHistory,
);

// Update an existing salary record
router.patch(
  "/:id",
  authorizeRoles("developer", "admin"),
  updateEmployeeSalary,
);

export default router;
