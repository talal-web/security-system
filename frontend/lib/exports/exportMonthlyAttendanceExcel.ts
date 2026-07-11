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

  const rows: Array<Array<string | number>> = [
    ["BAIDAR SECURITY SERVICE"],
    ["MONTHLY ATTENDANCE REPORT"],
    [],
    ["Month", `${monthName} ${month.year}`],
    ["Generated", new Date().toLocaleDateString()],
    [],
    [
      "Employee ID",
      "Employee Name",
      "Father Name",
      "Designation",
      ...Array.from({ length: month.days }, (_, index) => `Day ${index + 1}`),
      "Present",
      "Leave",
      "Absent",
      "Total",
    ],
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
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Attendance");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([excelBuffer], {
      type: "application/octet-stream",
    }),
    `Monthly_Attendance_${month.value}.xlsx`,
  );
}
