import express from "express";

import {
  createFine,
  getFines,
  getEmployeeFines,
  updateFine,
  cancelFine,
} from "../controllers/fineController.js";

import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { requireAreaAccess } from "../middlewares/areaScopeMiddleware.js";
import { validate } from "../validators/validate.js";
import {
  createFineSchema,
  updateFineSchema,
} from "../validators/fineSchemas.js";

const router = express.Router();

// Create fine
router.post(
  "/",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  validate(createFineSchema),
  createFine,
);

// Get all fines / filter by employee or status
router.get(
  "/",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  requireAreaAccess,
  getFines,
);

// Get employee fine history
router.get(
  "/employee/:employeeId",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  requireAreaAccess,
  getEmployeeFines,
);

// Correct fine before any deduction
router.patch(
  "/:id",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  validate(updateFineSchema),
  updateFine,
);

// Cancel fine before any deduction
router.patch(
  "/:id/cancel",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  cancelFine,
);

export default router;
