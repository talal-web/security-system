// routes/sector.routes.js

import express from "express";

import {
  createSector,
  deleteSector,
  getSectorById,
  getSectors,
  reorderSectors,
  updateSector,
} from "../controllers/sectorController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// CRUD
router.route("/").post(createSector).get(getSectors);

router.patch("/reorder", reorderSectors);

router
  .route("/:id")
  .get(getSectorById)
  .patch(updateSector)
  .delete(deleteSector);

export default router;
