import type {
  AttendanceExportRow,
  AttendanceGlobalStats,
} from "@/types/attendance";

import { buildAttendanceWorksheet } from "./attendanceExportWorksheet";

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
  const ExcelJS = await import("exceljs");
  const { saveAs } = await import("file-saver");

  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Security Management System";
  workbook.lastModifiedBy = "Security Management System";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet(title.slice(0, 31), {
    views: [{ showGridLines: false }],
  });

  buildAttendanceWorksheet({
    worksheet,
    title,
    employees,
    globalStats,
  });

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument/spreadsheetml.sheet",
  });

  saveAs(blob, `${title}.xlsx`);
}
