import type { Row, Worksheet } from "exceljs";

import type {
  AttendanceExportRow,
  AttendanceGlobalStats,
} from "@/types/attendance";

import {
  ATTENDANCE_EXPORT_COLORS,
  applyDefaultWorksheetFont,
  applyHeaderStyle,
  applyLocationStyle,
  applyShiftCellStyle,
  applyStatusCellStyle,
  setCellBorder,
} from "./attendanceExportStyles";
import {
  formatAttendanceShift,
  formatAttendanceStatus,
} from "./attendanceExportFormat";
import { groupEmployeesBySectorAndLocation } from "./attendanceExportGrouping";

export const addTitleAndGeneratedRows = (
  worksheet: Worksheet,
  title: string,
) => {
  const titleRow = worksheet.addRow([title]);
  worksheet.mergeCells(`A${titleRow.number}:E${titleRow.number}`);
  titleRow.height = 30;
  titleRow.font = {
    name: "Calibri",
    size: 16,
    bold: true,
    color: { argb: ATTENDANCE_EXPORT_COLORS.white },
  };
  titleRow.alignment = {
    horizontal: "center",
    vertical: "middle",
  };
  titleRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: ATTENDANCE_EXPORT_COLORS.primary },
  };

  const generatedRow = worksheet.addRow([
    `Generated: ${new Date().toLocaleString()}`,
  ]);
  worksheet.mergeCells(`A${generatedRow.number}:E${generatedRow.number}`);
  generatedRow.height = 20;
  generatedRow.font = {
    italic: true,
    size: 10,
    color: { argb: ATTENDANCE_EXPORT_COLORS.muted },
  };
  generatedRow.alignment = {
    horizontal: "right",
    vertical: "middle",
  };

  worksheet.addRow([]);

  return { titleRow, generatedRow };
};

export const addAttendanceSummaryRows = (
  worksheet: Worksheet,
  globalStats?: AttendanceGlobalStats,
) => {
  if (!globalStats) return;

  const summaryTitleRow = worksheet.addRow(["Attendance Summary"]);
  worksheet.mergeCells(`A${summaryTitleRow.number}:E${summaryTitleRow.number}`);
  summaryTitleRow.font = {
    bold: true,
    size: 12,
    color: { argb: ATTENDANCE_EXPORT_COLORS.headerText },
  };
  summaryTitleRow.alignment = {
    horizontal: "left",
    vertical: "middle",
  };
  summaryTitleRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: ATTENDANCE_EXPORT_COLORS.primary },
  };

  const summaryData = [
    ["Day Shift", globalStats.day],
    ["Night Shift", globalStats.night],
    ["Present", globalStats.present],
    ["Leave", globalStats.leave],
    ["Total Employees", globalStats.total],
  ];

  for (const [label, value] of summaryData) {
    const row = worksheet.addRow([label, value]);
    row.getCell(1).font = { bold: true };
    row.getCell(2).font = { bold: true };
    row.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: ATTENDANCE_EXPORT_COLORS.primaryLight },
    };
    row.eachCell((cell: import("exceljs").Cell) => setCellBorder(cell));
  }

  worksheet.addRow([]);
};

export const addEmployeeTableHeader = (worksheet: Worksheet) => {
  const headerRow = worksheet.addRow([
    "#",
    "Name",
    "Father Name",
    "Shift",
    "Status",
  ]);
  applyHeaderStyle(headerRow);
  return headerRow;
};

export const addGroupedEmployeeRows = (
  worksheet: Worksheet,
  employees: AttendanceExportRow[],
) => {
  const groupedEmployees = groupEmployeesBySectorAndLocation(employees);
  let employeeNumber = 1;

  for (const [, locationMap] of groupedEmployees) {
    for (const [location, locationEmployees] of locationMap) {
      const locationRow = worksheet.addRow([`Location: ${location}`]);
      worksheet.mergeCells(`A${locationRow.number}:E${locationRow.number}`);
      applyLocationStyle(locationRow);

      for (const employee of locationEmployees) {
        const row = worksheet.addRow([
          employeeNumber++,
          employee.name ?? "-",
          employee.fatherName ?? "-",
          formatAttendanceShift(employee.shift),
          formatAttendanceStatus(employee.status),
        ]);

        row.height = 21;

        row.getCell(1).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        row.getCell(4).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        row.getCell(5).alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        row.eachCell((cell: import("exceljs").Cell) => setCellBorder(cell));
        applyStatusCellStyle(row.getCell(5), employee.status);
        applyShiftCellStyle(row.getCell(4), employee.shift);
      }

      worksheet.addRow([]);
    }
  }
};

export const configureAttendanceWorksheet = (
  worksheet: Worksheet,
  headerRow: Row,
) => {
  worksheet.columns = [
    { key: "number", width: 7 },
    { key: "name", width: 25 },
    { key: "fatherName", width: 25 },
    { key: "shift", width: 14 },
    { key: "status", width: 15 },
  ];

  worksheet.views = [
    {
      state: "frozen",
      ySplit: headerRow.number,
      showGridLines: false,
    },
  ];

  worksheet.pageSetup = {
    orientation: "portrait",
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  worksheet.headerFooter.oddFooter = "&CPage &P of &N";
};

export const buildAttendanceWorksheet = ({
  worksheet,
  title,
  employees,
  globalStats,
}: {
  worksheet: Worksheet;
  title: string;
  employees: AttendanceExportRow[];
  globalStats?: AttendanceGlobalStats;
}) => {
  applyDefaultWorksheetFont(worksheet);
  addTitleAndGeneratedRows(worksheet, title);
  addAttendanceSummaryRows(worksheet, globalStats);
  const headerRow = addEmployeeTableHeader(worksheet);
  addGroupedEmployeeRows(worksheet, employees);
  configureAttendanceWorksheet(worksheet, headerRow);

  return worksheet;
};
