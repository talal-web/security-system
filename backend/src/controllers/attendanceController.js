import {
  getAttendanceByIdService,
  getAttendanceSessionService,
  submitAttendanceSessionService,
  updateAttendanceService,
  updateEmployeesSectorService,
  updateEmployeeLocationsService,
  updateEmployeeShiftsService,
} from "../services/attendance/attendance.service.js";

import { getMonthlyAttendanceReportService } from "../services/attendance/attendanceMonthly.service.js";

import { getAttendanceReportService } from "../services/attendance/attendanceReport.service.js";

// Get Attendance Report
export const getAttendanceReport = async (req, res) => {
  const result = await getAttendanceReportService({
    query: req.query,
    areaScope: req.areaScope,
  });

  res.status(200).json(result);
};

// Get Attendance By ID
export const getAttendanceById = async (req, res) => {
  const result = await getAttendanceByIdService({
    id: req.params.id,
    areaScope: req.areaScope,
  });

  res.status(200).json(result);
};

// Update Attendance
export const updateAttendance = async (req, res) => {
  const result = await updateAttendanceService({
    id: req.params.id,
    user: req.user,
    areaScope: req.areaScope,
    body: req.body,
  });

  res.status(200).json(result);
};

// Get Attendance Session
export const getAttendanceSession = async (req, res) => {
  const result = await getAttendanceSessionService({
    areaScope: req.areaScope,
  });

  res.status(200).json({ success: true, ...result });
};

// Submit Attendance Session
export const submitAttendanceSession = async (req, res) => {
  const result = await submitAttendanceSessionService({
    body: req.body,
    areaScope: req.areaScope,
  });

  res.status(200).json({ success: true, ...result });
};

// Get Monthly Attendance Report
export const getMonthlyAttendanceReport = async (req, res) => {
  const result = await getMonthlyAttendanceReportService({
    query: req.query,
    areaScope: req.areaScope,
  });

  res.status(200).json(result);
};

// Update Employee Locations
export const updateEmployeeLocations = async (req, res) => {
  const result = await updateEmployeeLocationsService({
    body: req.body,
    areaScope: req.areaScope,
  });

  res.status(200).json({ success: true, ...result });
};

// Update Employee Sectors
export const updateEmployeesSector = async (req, res) => {
  const result = await updateEmployeesSectorService({
    body: req.body,
    areaScope: req.areaScope,
  });

  res.status(200).json({ success: true, ...result });
};

// Update Employee Shifts
export const updateEmployeeShifts = async (req, res) => {
  const result = await updateEmployeeShiftsService({
    body: req.body,
    areaScope: req.areaScope,
  });

  res.status(200).json({ success: true, ...result });
};
