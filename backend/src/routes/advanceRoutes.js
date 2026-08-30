import express from "express";

import {
  createAdvance,
  getAdvances,
  getEmployeeAdvances,
  updateAdvance,
  cancelAdvance,
} from "../controllers/advanceController.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create advance
router.post("/", authorizeRoles("developer", "admin", "clerk"), createAdvance);

// Get all advances / filter by employee or status
router.get(
  "/",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  getAdvances,
);

// Get employee advance history
router.get(
  "/employee/:employeeId",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  getEmployeeAdvances,
);

// Correct an advance before any deduction
router.patch(
  "/:id",
  authorizeRoles("developer", "admin", "clerk"),
  updateAdvance,
);

// Cancel an advance before any deduction
router.patch(
  "/:id/cancel",
  authorizeRoles("developer", "admin", "clerk"),
  cancelAdvance,
);

export default router;
