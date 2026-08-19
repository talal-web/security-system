import express from "express";

import {
  getAttendanceReport,
  getMonthlyAttendanceReport,
  getAttendanceSession,
  submitAttendanceSession,
  updateEmployeeLocations,
  updateEmployeeShifts,
} from "../controllers/attendanceController.js";

const router = express.Router();

// Fetch attendance session (employees, locations, defaults)
router.get("/session", getAttendanceSession);

// Update employee current locations
router.patch("/session/locations", updateEmployeeLocations);

// Update employee default shift
router.patch("/session/shifts", updateEmployeeShifts);

// Submit/update attendance session
router.post("/session", submitAttendanceSession);

// Attendance reports & statistics
router.get("/report", getAttendanceReport);

router.get("/report/monthly", getMonthlyAttendanceReport);

export default router;
