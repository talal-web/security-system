// routes/employeeRoutes.js

import express from "express";

import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/**
 * Employee Routes
 */

// ======================================
// Multer Fields
// ======================================

const employeeImageUpload = upload.fields([
  {
    name: "profileImage",
    maxCount: 1,
  },

  {
    name: "cnicFrontImage",
    maxCount: 1,
  },

  {
    name: "cnicBackImage",
    maxCount: 1,
  },
]);

// ======================================
// Create Employee
// ======================================

router.post("/", employeeImageUpload, createEmployee);

// ======================================
// Get All Employees
// ======================================

router.get("/", getEmployees);

// ======================================
// Get Single Employee
// ======================================

router.get("/:id", getEmployeeById);

// ======================================
// Update Employee
// ======================================

router.put("/:id", employeeImageUpload, updateEmployee);

// ======================================
// Delete Employee
// ======================================

router.delete("/:id", deleteEmployee);

export default router;
