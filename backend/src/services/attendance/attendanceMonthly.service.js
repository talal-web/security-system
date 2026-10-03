import mongoose from "mongoose";

import Attendance from "../../models/Attendance.js";
import Employee from "../../models/Employee.js";
import ApiError from "../../utils/ApiError.js";

import { getMonthDays, mapAttendanceStatus } from "./attendance.helpers.js";

import { validateMonth } from "./attendance.validation.js";

// enforceAreaScope has already validated exactly one area.
// areaScope.areaId is the single source of truth. query.area is ignored.
const getScopedAreaId = (areaScope = {}) => {
  const areaId = areaScope?.areaId;

  if (typeof areaId !== "string" || !areaId.trim()) {
    throw new ApiError(400, "Area selection is required");
  }

  if (!mongoose.Types.ObjectId.isValid(areaId)) {
    throw new ApiError(400, "Invalid area ID");
  }

  return areaId;
};

// ======================================
// Get Monthly Attendance Report
// ======================================

export const getMonthlyAttendanceReportService = async ({
  query = {},
  areaScope = {},
}) => {
  const areaId = getScopedAreaId(areaScope);

  const month = validateMonth(query.month);
  const [year, monthNumber] = month.split("-").map(Number);

  const totalDays = new Date(year, monthNumber, 0).getDate();

  const monthStart = `${year}-${String(monthNumber).padStart(2, "0")}-01`;

  const monthEnd = `${year}-${String(monthNumber).padStart(2, "0")}-${String(
    totalDays,
  ).padStart(2, "0")}`;

  const days = getMonthDays(year, monthNumber);

  const monthInfo = {
    value: month,
    year,
    month: monthNumber,
    days: totalDays,
  };

  // ======================================
  // Find Employees in Selected Area
  // ======================================

  const employees = await Employee.find({
    area: areaId,
    $or: [
      { status: "active" },
      {
        status: "inactive",
        exitDate: {
          $gte: new Date(`${monthStart}T00:00:00.000Z`),
        },
      },
    ],
  })
    .select("_id empId name fatherName designation status exitDate area")
    .sort({ empId: 1 })
    .lean();

  // ======================================
  // Find Attendance for Selected Employees
  // ======================================

  const employeeIds = employees.map((employee) => employee._id);
  const areaConditions = [{ area: areaId }];

  if (employeeIds.length) {
    areaConditions.push({
      area: null,
      employee: { $in: employeeIds },
    });
  }

  const attendance = await Attendance.find({
    date: {
      $gte: monthStart,
      $lte: monthEnd,
    },
    $or: areaConditions,
  })
    .select("employee area employeeSnapshot date status")
    .lean();

  // ======================================
  // Initialize Report
  // ======================================

  const overall = {
    employees: 0,
    present: 0,
    leave: 0,
    absent: 0,
    total: 0,
  };

  const employeeMap = new Map();

  for (const employee of employees) {
    const attendanceDays = {};

    for (const day of days) {
      attendanceDays[day] = "-";
    }

    employeeMap.set(employee._id.toString(), {
      employeeId: employee._id,
      empId: employee.empId,
      name: employee.name,
      fatherName: employee.fatherName,
      designation: employee.designation,
      summary: {
        present: 0,
        leave: 0,
        absent: 0,
        total: 0,
      },
      attendance: attendanceDays,
    });
  }

  // ======================================
  // Map Attendance Records
  // ======================================

  for (const record of attendance) {
    if (!record.date || !record.employee) continue;

    const [recordYear, recordMonth, recordDay] = record.date
      .split("-")
      .map(Number);

    if (
      recordYear !== year ||
      recordMonth !== monthNumber ||
      recordDay < 1 ||
      recordDay > totalDays
    ) {
      continue;
    }

    let employee = employeeMap.get(record.employee.toString());

    if (
      !employee &&
      record.area?.toString() === areaId &&
      record.employeeSnapshot?.empId
    ) {
      const snapshot = record.employeeSnapshot;
      const attendanceDays = Object.fromEntries(
        days.map((day) => [day, "-"]),
      );

      employee = {
        employeeId: record.employee,
        empId: snapshot.empId,
        name: snapshot.name,
        fatherName: snapshot.fatherName,
        designation: snapshot.designation,
        summary: {
          present: 0,
          leave: 0,
          absent: 0,
          total: 0,
        },
        attendance: attendanceDays,
      };

      employeeMap.set(record.employee.toString(), employee);
    }

    if (!employee) continue;

    const status = mapAttendanceStatus(record.status);

    employee.attendance[recordDay] = status;

    switch (status) {
      case "P":
        employee.summary.present++;
        employee.summary.total++;
        overall.present++;
        overall.total++;
        break;

      case "L":
        employee.summary.leave++;
        employee.summary.total++;
        overall.leave++;
        overall.total++;
        break;

      case "A":
        employee.summary.absent++;
        overall.absent++;
        break;

      default:
        break;
    }
  }

  // ======================================
  // Sort Employees
  // ======================================

  const report = Array.from(employeeMap.values());
  overall.employees = report.length;

  const getEmployeeNumber = (empId) => {
    const match = empId?.match(/(\d+)$/);

    return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
  };

  report.sort(
    (a, b) => getEmployeeNumber(a.empId) - getEmployeeNumber(b.empId),
  );

  // ======================================
  // Response
  // ======================================

  return {
    success: true,
    message: "Monthly attendance report fetched successfully",
    data: {
      month: monthInfo,
      overall,
      employees: report,
    },
  };
};
