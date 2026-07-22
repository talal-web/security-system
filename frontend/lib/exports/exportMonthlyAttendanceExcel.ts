import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

import type {
  MonthlyAttendanceEmployee,
  MonthlyAttendanceMonth,
  MonthlyAttendanceOverall,
} from "@/types/attendance";

interface ExportMonthlyAttendanceExcelOptions {
  month: MonthlyAttendanceMonth;
  overall: MonthlyAttendanceOverall;
  employees: MonthlyAttendanceEmployee[];
}

export async function exportMonthlyAttendanceExcel({
  month,
  overall,
  employees,
}: ExportMonthlyAttendanceExcelOptions): Promise<void> {
  const monthName = new Date(month.year, month.month - 1).toLocaleString(
    "default",
    {
      month: "long",
    },
  );

  // Day numbers (1,2,3...)
  const dayNumbers = Array.from(
    { length: month.days },
    (_, index) => index + 1,
  );

  // Weekday names (Sun, Mon, Tue...)
  const weekDays = Array.from({ length: month.days }, (_, index) => {
    const date = new Date(month.year, month.month - 1, index + 1);

    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  });

  const rows: Array<Array<string | number>> = [
    ["BAIDAR SECURITY SERVICE"],
    ["MONTHLY ATTENDANCE REPORT"],
    [],
    ["Month", `${monthName} ${month.year}`],
    ["Generated", new Date().toLocaleDateString()],
    [],

    // Header Row 1
    [
      "ID",
      "Name",
      "Father Name",
      "Designation",
      ...dayNumbers,
      "Present",
      "Leave",
      "Absent",
      "Total",
    ],

    // Header Row 2
    ["", "", "", "", ...weekDays, "", "", "", ""],
  ];

  employees.forEach((employee) => {
    rows.push([
      employee.empId,
      employee.name,
      employee.fatherName,
      employee.designation,

      ...Array.from({ length: month.days }, (_, index) => {
        const dayKey = String(index + 1);
        return employee.attendance[dayKey] ?? "-";
      }),

      employee.summary.present,
      employee.summary.leave,
      employee.summary.absent,
      employee.summary.total,
    ]);
  });

  rows.push([]);
  rows.push(["Overall Summary"]);
  rows.push(["Employees", overall.employees]);
  rows.push(["Present", overall.present]);
  rows.push(["Leave", overall.leave]);
  rows.push(["Absent", overall.absent]);
  rows.push(["Total", overall.total]);

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  // Better column widths
  worksheet["!cols"] = [
    { wch: 12 }, // ID
    { wch: 24 }, // Name
    { wch: 24 }, // Father Name
    { wch: 18 }, // Designation

    ...Array.from({ length: month.days }, () => ({
      wch: 5,
    })),

    { wch: 10 }, // Present
    { wch: 10 }, // Leave
    { wch: 10 }, // Absent
    { wch: 10 }, // Total
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Attendance");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `Monthly_Attendance_${month.value}.xlsx`,
  );
}
