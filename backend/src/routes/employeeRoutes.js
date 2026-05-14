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

import { protect } from "../middleware/authMiddleware.js";

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
  protect,
  authorizeRoles("developer", "admin", "supervisor"),
  employeeImageUpload,
  createEmployee,
);

// GET ALL
router.get(
  "/",
  protect,
  authorizeRoles("developer", "admin", "supervisor"),
  getEmployees,
);

// GET SINGLE
router.get(
  "/:id",
  protect,
  authorizeRoles("developer", "admin", "supervisor"),
  getEmployeeById,
);

// UPDATE
router.put(
  "/:id",
  protect,
  authorizeRoles("developer", "admin", "supervisor"),
  employeeImageUpload,
  updateEmployee,
);

// DELETE (ONLY DEVELOPER + ADMIN)
router.delete(
  "/:id",
  protect,
  authorizeRoles("developer", "admin"),
  deleteEmployee,
);

export default router;
