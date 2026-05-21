// routes/attendance.routes.js

import express from "express";

import {
  markAttendance,
  getAllAttendance,
  getAttendanceByEmployee,
  updateAttendance,
  deleteAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

// MARK ATTENDANCE
router.post("/mark", markAttendance);

// GET ALL ATTENDANCE
router.get("/", getAllAttendance);

// GET EMPLOYEE ATTENDANCE
router.get("/:employeeId", getAttendanceByEmployee);

// UPDATE ATTENDANCE
router.put("/:id", updateAttendance);

// DELETE ATTENDANCE
router.delete("/:id", deleteAttendance);

export default router;
