import { formatSectorName } from "./formatSectorName";

import type {
  AttendanceExportRow,
  AttendanceGlobalStats,
} from "@/types/attendance";

interface ExportAttendanceToExcelOptions {
  employees: AttendanceExportRow[];
  title: string;
  globalStats?: AttendanceGlobalStats;
}

export async function exportAttendanceToExcel({
  employees,
  title,
  globalStats,
}: ExportAttendanceToExcelOptions): Promise<void> {
  const XLSX = await import("xlsx");
  const { saveAs } = await import("file-saver");

  const data = employees.map((employee, index) => ({
    "#": index + 1,
    Sector: formatSectorName(employee.sector ?? "-"),
    Location: employee.location ?? "-",
    "Employee ID": employee.empId,
    "Employee Name": employee.name,
    "Father Name": employee.fatherName,
    Designation: employee.designation,
    Shift: employee.shift ?? "-",
    Status: employee.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet([]);

  // Summary section
  if (globalStats) {
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        ["Attendance Summary"],
        [],
        ["Day Shift", globalStats.day],
        ["Night Shift", globalStats.night],
        ["Present", globalStats.present],
        ["Leave", globalStats.leave],
        ["Total Employees", globalStats.total],
        // ["Absent", globalStats.absent],
        [],
      ],
      { origin: "A1" },
    );
  }

  // Attendance table
  XLSX.utils.sheet_add_json(worksheet, data, {
    origin: globalStats ? "B10" : "A1",
    skipHeader: false,
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title);

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([excelBuffer], {
      type: "application/octet-stream",
    }),
    `${title}.xlsx`,
  );
}
