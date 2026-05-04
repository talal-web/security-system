// routes/employeeRoutes.js

import express from "express";

import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controller/EmployeeController.js";

const router = express.Router();

// ======================================
// Employee Routes
// ======================================

// Create Employee
router.post("/", createEmployee);

// Get All Employees
router.get("/", getEmployees);

// Get Single Employee
router.get("/:id", getEmployeeById);

// Update Employee
router.put("/:id", updateEmployee);

// Delete Employee
router.delete("/:id", deleteEmployee);

export default router;
