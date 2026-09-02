import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import type {
  MonthlyAttendanceEmployee,
  MonthlyAttendanceMonth,
  MonthlyAttendanceOverall,
} from "@/types/attendance";

import { formatText } from "@/utils/employee/employeeFormat";

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

  const dayNumbers = Array.from(
    { length: month.days },
    (_, index) => index + 1,
  );

  const weekDays = Array.from({ length: month.days }, (_, index) => {
    const date = new Date(month.year, month.month - 1, index + 1);

    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  });

  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Baidar Security Service";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet("Monthly Attendance", {
    views: [
      {
        state: "frozen",
        xSplit: 4,
        ySplit: 7,
      },
    ],
  });

  const totalColumns = 4 + month.days + 4;

  /*
   * --------------------------------------------------
   * COLUMN WIDTHS
   * --------------------------------------------------
   */

  worksheet.getColumn(1).width = 12;
  worksheet.getColumn(2).width = 24;
  worksheet.getColumn(3).width = 24;
  worksheet.getColumn(4).width = 20;

  for (let column = 5; column <= 4 + month.days; column++) {
    worksheet.getColumn(column).width = 5;
  }

  const summaryStartColumn = 5 + month.days;

  for (let column = summaryStartColumn; column <= totalColumns; column++) {
    worksheet.getColumn(column).width = 10;
  }

  /*
   * --------------------------------------------------
   * COMPANY TITLE
   * --------------------------------------------------
   */

  worksheet.mergeCells(1, 1, 1, totalColumns);

  const companyTitle = worksheet.getCell(1, 1);

  companyTitle.value = "BAIDAR SECURITY SERVICE";
  companyTitle.font = {
    name: "Arial",
    size: 18,
    bold: true,
  };

  companyTitle.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getRow(1).height = 30;

  /*
   * --------------------------------------------------
   * REPORT TITLE
   * --------------------------------------------------
   */

  worksheet.mergeCells(2, 1, 2, totalColumns);

  const reportTitle = worksheet.getCell(2, 1);

  reportTitle.value = "MONTHLY ATTENDANCE REPORT";
  reportTitle.font = {
    name: "Arial",
    size: 13,
    bold: true,
  };

  reportTitle.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getRow(2).height = 22;

  /*
   * --------------------------------------------------
   * REPORT INFORMATION
   * --------------------------------------------------
   */

  worksheet.mergeCells(4, 1, 4, 2);
  worksheet.mergeCells(4, 3, 4, 4);

  worksheet.getCell(4, 1).value = "Month";
  worksheet.getCell(4, 3).value = `${monthName} ${month.year}`;

  worksheet.mergeCells(5, 1, 5, 2);
  worksheet.mergeCells(5, 3, 5, 4);

  worksheet.getCell(5, 1).value = "Generated";
  worksheet.getCell(5, 3).value = new Date().toLocaleDateString();

  for (const rowNumber of [4, 5]) {
    worksheet.getCell(rowNumber, 1).font = {
      bold: true,
    };

    worksheet.getCell(rowNumber, 1).alignment = {
      horizontal: "left",
      vertical: "middle",
    };

    worksheet.getCell(rowNumber, 3).alignment = {
      horizontal: "left",
      vertical: "middle",
    };
  }

  /*
   * --------------------------------------------------
   * ATTENDANCE HEADER
   * --------------------------------------------------
   */

  const headerRow1 = worksheet.getRow(7);
  const headerRow2 = worksheet.getRow(8);

  const headers = [
    "ID",
    "Name",
    "Father Name",
    "Designation",
    ...dayNumbers,
    "Present",
    "Leave",
    "Absent",
    "Total",
  ];

  headers.forEach((value, index) => {
    headerRow1.getCell(index + 1).value = value;
  });

  weekDays.forEach((value, index) => {
    headerRow2.getCell(index + 5).value = value;
  });

  /*
   * Merge identity + summary headers vertically
   */

  for (let column = 1; column <= 4; column++) {
    worksheet.mergeCells(7, column, 8, column);
  }

  for (let column = summaryStartColumn; column <= totalColumns; column++) {
    worksheet.mergeCells(7, column, 8, column);
  }

  /*
   * Header styling
   */

  for (let row = 7; row <= 8; row++) {
    const currentRow = worksheet.getRow(row);

    currentRow.height = 24;

    currentRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        size: 10,
      };

      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };

      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
  }

  /*
   * --------------------------------------------------
   * EMPLOYEE DATA
   * --------------------------------------------------
   */

  const employeeStartRow = 9;

  employees.forEach((employee, employeeIndex) => {
    const rowNumber = employeeStartRow + employeeIndex;

    const designation = formatText(employee.designation?.replace(/_/g, " "));

    const row = worksheet.getRow(rowNumber);

    row.values = [
      employee.empId,
      employee.name,
      employee.fatherName,
      designation,

      ...Array.from({ length: month.days }, (_, index) => {
        const dayKey = String(index + 1);

        return employee.attendance[dayKey] ?? "-";
      }),

      employee.summary.present,
      employee.summary.leave,
      employee.summary.absent,
      employee.summary.total,
    ];

    row.height = 21;

    row.eachCell((cell) => {
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      cell.border = {
        top: { style: "hair" },
        bottom: { style: "hair" },
        left: { style: "hair" },
        right: { style: "hair" },
      };
    });

    // Employee information
    for (let column = 2; column <= 4; column++) {
      row.getCell(column).alignment = {
        horizontal: "left",
        vertical: "middle",
      };
    }

    /*
     * Attendance status formatting
     */

    for (let day = 0; day < month.days; day++) {
      const cell = row.getCell(5 + day);

      const value = String(cell.value ?? "").toUpperCase();

      if (value === "P") {
        cell.font = {
          bold: true,
        };
      } else if (value === "L") {
        cell.font = {
          bold: true,
        };
      } else if (value === "A") {
        cell.font = {
          bold: true,
        };
      } else if (value === "DN") {
        cell.font = {
          bold: true,
        };
      }
    }

    /*
     * Summary columns
     */

    for (let column = summaryStartColumn; column <= totalColumns; column++) {
      row.getCell(column).font = {
        bold: true,
      };
    }
  });

  /*
   * --------------------------------------------------
   * OVERALL SUMMARY
   * --------------------------------------------------
   */

  const summaryStartRow = employeeStartRow + employees.length + 2;

  worksheet.mergeCells(summaryStartRow, 1, summaryStartRow, 4);

  const summaryTitle = worksheet.getCell(summaryStartRow, 1);

  summaryTitle.value = "OVERALL SUMMARY";
  summaryTitle.font = {
    bold: true,
    size: 12,
  };

  summaryTitle.alignment = {
    horizontal: "left",
    vertical: "middle",
  };

  worksheet.getRow(summaryStartRow).height = 24;

  const summaryRows = [
    ["Employees", overall.employees],
    ["Present", overall.present],
    ["Leave", overall.leave],
    ["Absent", overall.absent],
    ["Total", overall.total],
  ];

  summaryRows.forEach(([label, value], index) => {
    const rowNumber = summaryStartRow + index + 1;

    worksheet.mergeCells(rowNumber, 1, rowNumber, 2);

    worksheet.getCell(rowNumber, 1).value = label;
    worksheet.getCell(rowNumber, 3).value = value;

    worksheet.getCell(rowNumber, 1).font = {
      bold: true,
    };

    worksheet.getCell(rowNumber, 3).font = {
      bold: true,
    };

    worksheet.getCell(rowNumber, 1).alignment = {
      horizontal: "left",
      vertical: "middle",
    };

    worksheet.getCell(rowNumber, 3).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    for (let column = 1; column <= 3; column++) {
      worksheet.getCell(rowNumber, column).border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    }
  });

  /*
   * --------------------------------------------------
   * PRINT SETTINGS
   * --------------------------------------------------
   */

  // --------------------------------------------------
  // PRINT SETTINGS
  // --------------------------------------------------

  worksheet.pageSetup = {
    orientation: "landscape",
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    horizontalDpi: 300,
    verticalDpi: 300,
  };

  worksheet.pageSetup.printTitlesRow = "1:8";

  // ExcelJS 4.4.0 does not expose pageMargins
  // through its TypeScript Worksheet definition.

  /*
   * --------------------------------------------------
   * FOOTER
   * --------------------------------------------------
   */

  /*
   * --------------------------------------------------
   * EXPORT
   * --------------------------------------------------
   */

  const excelBuffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `Monthly_Attendance_${month.value}.xlsx`,
  );
}
