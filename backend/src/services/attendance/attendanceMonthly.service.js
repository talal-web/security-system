import Attendance from "../../models/Attendance.js";
import Employee from "../../models/Employee.js";
import { getMonthDays, mapAttendanceStatus } from "./attendance.helpers.js";
import { validateMonth } from "./attendance.validation.js";

// Get Monthly Attendance Report
export const getMonthlyAttendanceReportService = async ({
  query = {},
  areaScope = {},
}) => {
  const month = validateMonth(query.month);
  const [year, monthNumber] = month.split("-").map(Number);

  const totalDays = new Date(year, monthNumber, 0).getDate();

  const monthStart = `${year}-${String(monthNumber).padStart(2, "0")}-01`;

  const monthEnd = `${year}-${String(monthNumber).padStart(2, "0")}-${String(
    totalDays,
  ).padStart(2, "0")}`;

  const days = getMonthDays(year, monthNumber);

  const areaIds =
    areaScope.requestedAreaIds ?? areaScope.permittedAreaIds ?? [];

  const employeeQuery = {
    $or: [
      { status: "active" },
      {
        status: "inactive",
        exitDate: {
          $gte: new Date(`${monthStart}T00:00:00.000Z`),
        },
      },
    ],
  };

  if (areaIds.length && !areaScope.isAdmin) {
    employeeQuery.area = { $in: areaIds };
  }

  const employees = await Employee.find(employeeQuery)
    .select("_id empId name fatherName designation status exitDate area")
    .sort({ empId: 1 })
    .lean();

  const attendanceQuery = {
    date: {
      $gte: monthStart,
      $lte: monthEnd,
    },
  };

  if (areaIds.length && !areaScope.isAdmin) {
    const employeeIds = employees.map((employee) => employee._id);
    attendanceQuery.employee = { $in: employeeIds };
  }

  const attendance = await Attendance.find(attendanceQuery)
    .select("employee date status")
    .lean();

  const overall = {
    employees: employees.length,
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

    const employee = employeeMap.get(record.employee.toString());

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

  const report = Array.from(employeeMap.values());

  const getEmployeeNumber = (empId) => {
    const match = empId?.match(/(\d+)$/);

    return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
  };

  report.sort(
    (a, b) => getEmployeeNumber(a.empId) - getEmployeeNumber(b.empId),
  );

  return {
    success: true,
    message: "Monthly attendance report fetched successfully",
    data: {
      month: {
        value: month,
        year,
        month: monthNumber,
        days: totalDays,
      },
      overall,
      employees: report,
    },
  };
};
