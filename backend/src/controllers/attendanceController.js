// controllers/attendance.controller.js

import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

/**
 * MARK ATTENDANCE (Present / Absent / Leave)
 * Usually used by admin or supervisor
 */
export const markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, shift, remarks } = req.body;

    // validate employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // normalize date (remove time)
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // check if already marked
    const existing = await Attendance.findOne({
      employee: employeeId,
      date: attendanceDate,
      shift,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this date & shift",
      });
    }

    // create attendance
    const attendance = await Attendance.create({
      employee: employeeId,
      location: employee.location,
      date: attendanceDate,
      shift,
      status,
      remarks: remarks || "",
    });

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const data = await Attendance.find()
      .populate("employee", "fullName employeeId")
      .populate("location", "name")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAttendanceByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const data = await Attendance.find({ employee: employeeId })
      .populate("location", "name")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const attendance = await Attendance.findById(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    if (status) attendance.status = status;
    if (remarks !== undefined) attendance.remarks = remarks;

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Attendance updated",
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
