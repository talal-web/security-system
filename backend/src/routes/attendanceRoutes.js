import express from "express";

import {
  getAttendanceReport,
  getMonthlyAttendanceReport,
  getAttendanceSession,
  submitAttendanceSession,
  updateEmployeeLocations,
  updateEmployeeShifts,
} from "../controllers/attendanceController.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ======================================
// ATTENDANCE SESSION
// ======================================

// Fetch attendance session
router.get(
  "/session",
  authorizeRoles("developer", "admin", "clerk"),
  getAttendanceSession,
);

// Update employee current locations
router.patch(
  "/session/locations",
  authorizeRoles("developer", "admin", "clerk"),
  updateEmployeeLocations,
);

// Update employee default shift
router.patch(
  "/session/shifts",
  authorizeRoles("developer", "admin", "clerk"),
  updateEmployeeShifts,
);

// Submit/update attendance session
router.post(
  "/session",
  authorizeRoles("developer", "admin", "clerk"),
  submitAttendanceSession,
);

// ======================================
// ATTENDANCE REPORTS
// ======================================

// Daily attendance report
router.get(
  "/report",
  authorizeRoles("developer", "admin", "clerk"),
  getAttendanceReport,
);

// Monthly attendance report
router.get(
  "/report/monthly",
  authorizeRoles("developer", "admin", "clerk"),
  getMonthlyAttendanceReport,
);

export default router;
