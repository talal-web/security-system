// routes/employeeRoutes.js

import express from "express";

import {
  createEmployee,
  getEmployees,
  lookupEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

import upload from "../middleware/uploadMiddleware.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

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

// CREATE
router.post(
  "/",
  authorizeRoles("developer", "admin", "clerk"),
  employeeImageUpload,
  createEmployee,
);

// GET ALL
router.get(
  "/",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  getEmployees,
);

// LOOKUP BY EMPID
router.get(
  "/lookup",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  lookupEmployee,
);

// GET SINGLE
router.get(
  "/:id",
  authorizeRoles("developer", "admin", "clerk"),
  getEmployeeById,
);

// UPDATE
router.put(
  "/:id",
  authorizeRoles("developer", "admin", "clerk"),
  employeeImageUpload,
  updateEmployee,
);

// DELETE (ONLY DEVELOPER + ADMIN)
router.delete("/:id", authorizeRoles("developer", "admin"), deleteEmployee);

export default router;
