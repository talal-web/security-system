// routes/area.routes.js

import express from "express";

import {
  createArea,
  deleteArea,
  getAreaById,
  getAreas,
  reorderAreas,
  updateArea,
} from "../controllers/areaController.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { requireAreaAccess } from "../middleware/areaScopeMiddleware.js";

const router = express.Router();
router.post("/", authorizeRoles("admin", "developer"), createArea);
router.get(
  "/",
  authorizeRoles("admin", "developer", "clerk", "supervisor"),
  requireAreaAccess,
  getAreas,
);
router.patch("/reorder", authorizeRoles("admin", "developer"), reorderAreas);
router.get(
  "/:id",
  authorizeRoles("admin", "developer", "clerk", "supervisor"),
  requireAreaAccess,
  getAreaById,
);
router.patch("/:id", authorizeRoles("admin", "developer"), updateArea);
router.delete("/:id", authorizeRoles("admin", "developer"), deleteArea);

export default router;
