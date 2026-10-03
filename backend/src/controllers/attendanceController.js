import {
  getAttendanceByIdService,
  getAttendanceSessionService,
  submitAttendanceSessionService,
  updateAttendanceService,
  updateEmployeeLocationsService,
  updateEmployeeShiftsService,
} from "../services/attendance/attendance.service.js";

import { getMonthlyAttendanceReportService } from "../services/attendance/attendanceMonthly.service.js";

import { getAttendanceReportService } from "../services/attendance/attendanceReport.service.js";

// Sends every error (ApiError or unexpected) to the central error handler.
const handle = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res)).catch(next);

// Get Attendance Report
export const getAttendanceReport = handle(async (req, res) => {
  const result = await getAttendanceReportService({
    query: req.query,
    areaScope: req.areaScope,
  });

  res.status(200).json(result);
});

// Get Attendance By ID
export const getAttendanceById = handle(async (req, res) => {
  const result = await getAttendanceByIdService({
    id: req.params.id,
    areaScope: req.areaScope,
  });

  res.status(200).json(result);
});

// Update Attendance
export const updateAttendance = handle(async (req, res) => {
  const result = await updateAttendanceService({
    id: req.params.id,
    user: req.user,
    areaScope: req.areaScope,
    body: req.body,
  });

  res.status(200).json(result);
});

// Get Attendance Session
export const getAttendanceSession = handle(async (req, res) => {
  const result = await getAttendanceSessionService({
    areaScope: req.areaScope,
  });

  res.status(200).json({ success: true, ...result });
});

// Submit Attendance Session
export const submitAttendanceSession = handle(async (req, res) => {
  const result = await submitAttendanceSessionService({
    body: req.body,
    areaScope: req.areaScope,
  });

  res.status(200).json({ success: true, ...result });
});

// Get Monthly Attendance Report
export const getMonthlyAttendanceReport = handle(async (req, res) => {
  const result = await getMonthlyAttendanceReportService({
    query: req.query,
    areaScope: req.areaScope,
  });

  res.status(200).json(result);
});

// Update Employee Locations
export const updateEmployeeLocations = handle(async (req, res) => {
  const result = await updateEmployeeLocationsService({
    body: req.body,
    areaScope: req.areaScope,
  });

  res.status(200).json({ success: true, ...result });
});

// Update Employee Shifts
export const updateEmployeeShifts = handle(async (req, res) => {
  const result = await updateEmployeeShiftsService({
    body: req.body,
    areaScope: req.areaScope,
  });

  res.status(200).json({ success: true, ...result });
});
