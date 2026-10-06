import express from "express";

import {
  getAttendanceReport,
  getMonthlyAttendanceReport,
  getAttendanceSession,
  submitAttendanceSession,
  updateEmployeesSector,
  updateEmployeeLocations,
  updateEmployeeShifts,
  getAttendanceById,
  updateAttendance,
} from "../controllers/attendanceController.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { requireAreaAccess } from "../middleware/areaScopeMiddleware.js";

const router = express.Router();

// ======================================
// ATTENDANCE SESSION
// ======================================

// Fetch attendance session
router.get(
  "/session",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  getAttendanceSession,
);

// Update employee sector assignments and destination locations
router.patch(
  "/session/sectors",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  updateEmployeesSector,
);

// Update employee current locations within their assigned sectors
router.patch(
  "/session/locations",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  updateEmployeeLocations,
);

// Update employee default shift
router.patch(
  "/session/shifts",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  updateEmployeeShifts,
);

// Submit/update attendance session
router.post(
  "/session",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  submitAttendanceSession,
);

// ======================================
// ATTENDANCE REPORTS
// ======================================

// Daily attendance report
router.get(
  "/report",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  getAttendanceReport,
);

// Monthly attendance report
router.get(
  "/report/monthly",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  getMonthlyAttendanceReport,
);

// ======================================
// SINGLE ATTENDANCE RECORD
// ======================================

// Get single attendance record
router.get(
  "/:id",
  authorizeRoles("developer", "admin", "clerk"),
  requireAreaAccess,
  getAttendanceById,
);

// Update single attendance record
router.patch(
  "/:id",
  authorizeRoles("developer", "admin"),
  requireAreaAccess,
  updateAttendance,
);

export default router;
