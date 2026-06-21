import express from "express";

import {
  createAttendance,
  getAttendances,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  markBulkAttendance,

  // NEW
  getAttendanceSession,
  markAttendanceSession,
} from "../controllers/attendanceController.js";

const router = express.Router();

// ======================================
// ATTENDANCE SESSION
// ======================================

// Fetch employees + locations for attendance page
router.get("/session", getAttendanceSession);

// Mark attendance for all employees
router.post("/mark/session", markAttendanceSession);

// ======================================
// BULK ATTENDANCE
// ======================================

router.post("/bulk", markBulkAttendance);

// ======================================
// CRUD
// ======================================

router.post("/", createAttendance);

router.get("/sector", getAttendances);

router.get("/:id", getAttendanceById);

router.patch("/:id", updateAttendance);

router.delete("/:id", deleteAttendance);

export default router;
