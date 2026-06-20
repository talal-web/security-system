import express from "express";

import {
  createAttendance,
  getAttendances,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  markBulkAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

// Bulk attendance (place before :id routes)
router.post("/bulk", markBulkAttendance);

// CRUD
router.post("/", createAttendance);

router.get("/sector", getAttendances);

router.get("/:id", getAttendanceById);

router.patch("/:id", updateAttendance);

router.delete("/:id", deleteAttendance);

export default router;
