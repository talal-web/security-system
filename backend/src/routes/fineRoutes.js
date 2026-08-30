import express from "express";

import {
  createFine,
  getFines,
  getEmployeeFines,
  updateFine,
  cancelFine,
} from "../controllers/fineController.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create fine
router.post("/", authorizeRoles("developer", "admin", "clerk"), createFine);

// Get all fines / filter by employee or status
router.get(
  "/",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  getFines,
);

// Get employee fine history
router.get(
  "/employee/:employeeId",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  getEmployeeFines,
);

// Correct fine before any deduction
router.patch("/:id", authorizeRoles("developer", "admin", "clerk"), updateFine);

// Cancel fine before any deduction
router.patch(
  "/:id/cancel",
  authorizeRoles("developer", "admin", "clerk"),
  cancelFine,
);

export default router;
