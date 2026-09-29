import express from "express";

import {
  createBonus,
  getBonuses,
  getEmployeeBonuses,
  updateBonus,
  cancelBonus,
} from "../controllers/bonusController.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { requireAreaAccess } from "../middleware/areaScopeMiddleware.js";

const router = express.Router();

// Create bonus
router.post(
  "/",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  createBonus,
);

// Get all bonuses / filter by employee or status
router.get(
  "/",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  requireAreaAccess,
  getBonuses,
);

// Get employee bonus history
router.get(
  "/employee/:employeeId",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  requireAreaAccess,
  getEmployeeBonuses,
);

// Correct pending bonus
router.patch(
  "/:id",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  updateBonus,
);

// Cancel pending bonus
router.patch(
  "/:id/cancel",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  cancelBonus,
);

export default router;
