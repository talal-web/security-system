import express from "express";

import {
  createBonus,
  getBonuses,
  getEmployeeBonuses,
  updateBonus,
  cancelBonus,
} from "../controllers/bonusController.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create bonus
router.post("/", authorizeRoles("developer", "admin", "clerk"), createBonus);

// Get all bonuses / filter by employee or status
router.get(
  "/",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  getBonuses,
);

// Get employee bonus history
router.get(
  "/employee/:employeeId",
  authorizeRoles("developer", "admin", "clerk", "supervisor"),
  getEmployeeBonuses,
);

// Correct pending bonus
router.patch(
  "/:id",
  authorizeRoles("developer", "admin", "clerk"),
  updateBonus,
);

// Cancel pending bonus
router.patch(
  "/:id/cancel",
  authorizeRoles("developer", "admin", "clerk"),
  cancelBonus,
);

export default router;
