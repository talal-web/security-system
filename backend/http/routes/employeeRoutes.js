// http/routes/employeeRoutes.js

import express from "express";

import {
  createEmployee,
  getEmployees,
  lookupEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

import upload from "../middlewares/uploadMiddleware.js";

import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { requireAreaAccess } from "../middlewares/areaScopeMiddleware.js";
import { validate } from "../validators/validate.js";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "../validators/employeeSchemas.js";

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
  requireAreaAccess,
  employeeImageUpload,
  validate(createEmployeeSchema),
  createEmployee,
);

// GET ALL
router.get(
  "/",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  requireAreaAccess,
  getEmployees,
);

// LOOKUP BY EMPID
router.get(
  "/lookup",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  requireAreaAccess,
  lookupEmployee,
);

// GET SINGLE
router.get(
  "/:id",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  getEmployeeById,
);

// UPDATE
router.put(
  "/:id",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  employeeImageUpload,
  validate(updateEmployeeSchema),
  updateEmployee,
);

// DELETE (ONLY DEVELOPER + ADMIN)
router.delete(
  "/:id",
  authorizeRoles("developer", "admin"),
  requireAreaAccess,
  deleteEmployee,
);

export default router;
