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

const sendError = (res, error) => {
  const statusCode = error?.statusCode || 500;
  const message = error?.message || "An unexpected error occurred";
  const payload = {
    success: false,
    message,
  };

  if (error?.details) {
    Object.assign(payload, error.details);
  }

  return res.status(statusCode).json(payload);
};

export const getAttendanceReport = async (req, res) => {
  try {
    const result = await getAttendanceReportService({
      query: req.query,
      areaScope: req.areaScope || {},
    });

    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
};

export const getAttendanceById = async (req, res) => {
  try {
    const result = await getAttendanceByIdService({ id: req.params.id });
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const result = await updateAttendanceService({
      id: req.params.id,
      user: req.user,
      areaScope: req.areaScope || {},
      body: req.body,
    });

    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
};

export const getAttendanceSession = async (req, res) => {
  try {
    const result = await getAttendanceSessionService({
      areaScope: req.areaScope || {},
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const submitAttendanceSession = async (req, res) => {
  try {
    const result = await submitAttendanceSessionService({ body: req.body });
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getMonthlyAttendanceReport = async (req, res) => {
  try {
    const result = await getMonthlyAttendanceReportService({
      query: req.query,
      areaScope: req.areaScope || {},
    });

    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
};

export const updateEmployeeLocations = async (req, res) => {
  try {
    const result = await updateEmployeeLocationsService({
      body: req.body,
      areaScope: req.areaScope || {},
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const updateEmployeeShifts = async (req, res) => {
  try {
    const result = await updateEmployeeShiftsService({
      body: req.body,
      areaScope: req.areaScope || {},
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return sendError(res, error);
  }
};
