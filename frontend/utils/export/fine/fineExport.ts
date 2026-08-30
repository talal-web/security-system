import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import type { Fine, FineFilters } from "@/types/fine";

function getEmployeeId(fine: Fine): string {
  if (typeof fine.employee === "string") {
    return fine.employee;
  }

  return fine.employee?.empId ?? "-";
}

function getEmployeeName(fine: Fine): string {
  if (typeof fine.employee === "string") {
    return "-";
  }

  return fine.employee?.name ?? "-";
}

function getFatherName(fine: Fine): string {
  if (typeof fine.employee === "string") {
    return "-";
  }

  return fine.employee?.fatherName ?? "-";
}

function formatDate(date: string | Date): string {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "-";
  }

  return value.toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getDeductedAmount(fine: Fine): number {
  return Math.max(0, fine.amount - fine.remainingAmount);
}

function getStatusLabel(status: Fine["status"]): string {
  switch (status) {
    case "pending":
      return "Pending";

    case "partially_deducted":
      return "Partially Deducted";

    case "fully_deducted":
      return "Fully Deducted";

    case "cancelled":
      return "Cancelled";

    default:
      return status;
  }
}

function getFilterDescription(filters: FineFilters): string {
  const descriptions: string[] = [];

  if (filters.search) {
    descriptions.push(`Search: ${filters.search}`);
  }

  if (filters.employee) {
    descriptions.push(`Employee: ${filters.employee}`);
  }

  if (filters.status) {
    descriptions.push(`Status: ${getStatusLabel(filters.status)}`);
  }

  if (filters.fromDate) {
    descriptions.push(`From: ${filters.fromDate}`);
  }

  if (filters.toDate) {
    descriptions.push(`To: ${filters.toDate}`);
  }

  return descriptions.length > 0 ? descriptions.join(" | ") : "All Records";
}

function getFineSummary(fines: Fine[]) {
  const outstandingFines = fines.filter(
    (fine) => fine.status === "pending" || fine.status === "partially_deducted",
  );

  const uniqueEmployees = new Set(
    fines.map((fine) =>
      typeof fine.employee === "string" ? fine.employee : fine.employee?._id,
    ),
  ).size;

  const totalAmount = fines.reduce((total, fine) => total + fine.amount, 0);

  const totalDeducted = fines.reduce(
    (total, fine) => total + getDeductedAmount(fine),
    0,
  );

  const totalOutstanding = outstandingFines.reduce(
    (total, fine) => total + fine.remainingAmount,
    0,
  );

  return {
    uniqueEmployees,
    totalAmount,
    totalDeducted,
    totalOutstanding,
  };
}

export async function exportFinesToExcel(
  fines: Fine[],
  filters: FineFilters = {},
) {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Security Management System";
  workbook.lastModifiedBy = "Security Management System";
  workbook.created = new Date();
  workbook.modified = new Date();

  // =========================================================
  // COLORS
  // =========================================================

  const PRIMARY = "2563EB";
  const PRIMARY_DARK = "1E40AF";

  const SLATE_50 = "F8FAFC";
  const SLATE_100 = "F1F5F9";
  const SLATE_200 = "E2E8F0";
  const SLATE_500 = "64748B";
  const SLATE_700 = "334155";
  const SLATE_900 = "0F172A";

  const WHITE = "FFFFFF";

  const GREEN = "16A34A";
  const GREEN_LIGHT = "DCFCE7";

  const AMBER = "D97706";
  const AMBER_LIGHT = "FEF3C7";

  const RED = "DC2626";
  const RED_LIGHT = "FEE2E2";

  const BLUE_LIGHT = "DBEAFE";

  const CURRENCY_FORMAT = '#,##0" PKR"';

  const thinBorder = {
    top: {
      style: "thin" as const,
      color: { argb: SLATE_200 },
    },
    bottom: {
      style: "thin" as const,
      color: { argb: SLATE_200 },
    },
    left: {
      style: "thin" as const,
      color: { argb: SLATE_200 },
    },
    right: {
      style: "thin" as const,
      color: { argb: SLATE_200 },
    },
  };

  // =========================================================
  // SUMMARY
  // =========================================================

  const { uniqueEmployees, totalAmount, totalDeducted, totalOutstanding } =
    getFineSummary(fines);

  // =========================================================
  // WORKSHEET
  // =========================================================

  const worksheet = workbook.addWorksheet("Fine Report", {
    views: [
      {
        state: "frozen",
        ySplit: 7,
        showGridLines: false,
      },
    ],
  });

  // =========================================================
  // PAGE SETUP
  // =========================================================

  worksheet.pageSetup = {
    orientation: "landscape",
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    horizontalDpi: 300,
    verticalDpi: 300,
  };

  worksheet.pageSetup.printTitlesRow = "7:7";

  // =========================================================
  // TITLE
  // =========================================================

  worksheet.mergeCells("A1:H1");

  const titleCell = worksheet.getCell("A1");

  titleCell.value = "EMPLOYEE FINE REPORT";

  titleCell.font = {
    name: "Calibri",
    bold: true,
    size: 18,
    color: {
      argb: WHITE,
    },
  };

  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: PRIMARY,
    },
  };

  titleCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getRow(1).height = 34;

  // =========================================================
  // GENERATED
  // =========================================================

  worksheet.mergeCells("A2:H2");

  const generatedCell = worksheet.getCell("A2");

  generatedCell.value = `Generated: ${new Date().toLocaleString("en-PK")}`;

  generatedCell.font = {
    name: "Calibri",
    size: 10,
    italic: true,
    color: {
      argb: SLATE_500,
    },
  };

  generatedCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getRow(2).height = 18;

  // =========================================================
  // FILTERS
  // =========================================================

  worksheet.mergeCells("A3:H3");

  const filterCell = worksheet.getCell("A3");

  filterCell.value = `Filters: ${getFilterDescription(filters)}`;

  filterCell.font = {
    name: "Calibri",
    size: 10,
    italic: true,
    color: {
      argb: SLATE_500,
    },
  };

  filterCell.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  worksheet.getRow(3).height = 22;

  // =========================================================
  // SUMMARY CARDS
  // =========================================================

  const summaryCells = [
    {
      label: "Employees",
      value: uniqueEmployees,
      labelCell: "A5",
      valueCell: "B5",
      fill: BLUE_LIGHT,
      valueFormat: "#,##0",
    },
    {
      label: "Total Fines",
      value: totalAmount,
      labelCell: "C5",
      valueCell: "D5",
      fill: BLUE_LIGHT,
      valueFormat: CURRENCY_FORMAT,
    },
    {
      label: "Outstanding",
      value: totalOutstanding,
      labelCell: "E5",
      valueCell: "F5",
      fill: AMBER_LIGHT,
      valueFormat: CURRENCY_FORMAT,
    },
    {
      label: "Total Deducted",
      value: totalDeducted,
      labelCell: "G5",
      valueCell: "H5",
      fill: GREEN_LIGHT,
      valueFormat: CURRENCY_FORMAT,
    },
  ];

  for (const summary of summaryCells) {
    const labelCell = worksheet.getCell(summary.labelCell);
    const valueCell = worksheet.getCell(summary.valueCell);

    labelCell.value = summary.label;
    valueCell.value = summary.value;

    labelCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: summary.fill,
      },
    };

    valueCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: summary.fill,
      },
    };

    labelCell.font = {
      name: "Calibri",
      bold: true,
      size: 10,
      color: {
        argb: SLATE_700,
      },
    };

    valueCell.font = {
      name: "Calibri",
      bold: true,
      size: 11,
      color: {
        argb: SLATE_900,
      },
    };

    labelCell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    valueCell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    valueCell.numFmt = summary.valueFormat;

    labelCell.border = thinBorder;
    valueCell.border = thinBorder;
  }

  worksheet.getRow(5).height = 26;

  // =========================================================
  // TABLE HEADER
  // =========================================================

  const headerRow = worksheet.getRow(7);

  headerRow.values = [
    "Employee ID",
    "Employee Name",
    "Father Name",
    "Fine Date",
    "Fine Amount",
    "Deducted Amount",
    "Remaining Amount",
    "Status",
  ];

  headerRow.height = 28;

  headerRow.eachCell((cell) => {
    cell.font = {
      name: "Calibri",
      bold: true,
      size: 10,
      color: {
        argb: WHITE,
      },
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: PRIMARY_DARK,
      },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };

    cell.border = {
      top: {
        style: "thin",
        color: { argb: WHITE },
      },
      bottom: {
        style: "thin",
        color: { argb: WHITE },
      },
      left: {
        style: "thin",
        color: { argb: WHITE },
      },
      right: {
        style: "thin",
        color: { argb: WHITE },
      },
    };
  });

  // =========================================================
  // DATA
  // =========================================================

  fines.forEach((fine, index) => {
    const deductedAmount = getDeductedAmount(fine);

    const row = worksheet.addRow([
      getEmployeeId(fine),
      getEmployeeName(fine),
      getFatherName(fine),
      formatDate(fine.fineDate),
      fine.amount,
      deductedAmount,
      fine.remainingAmount,
      getStatusLabel(fine.status),
    ]);

    row.height = 22;

    row.eachCell((cell) => {
      cell.font = {
        name: "Calibri",
        size: 10,
        color: {
          argb: SLATE_900,
        },
      };

      cell.alignment = {
        vertical: "middle",
      };

      cell.border = thinBorder;

      if (index % 2 === 1) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: SLATE_50,
          },
        };
      }
    });

    // Employee ID
    row.getCell(1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    // Date
    row.getCell(4).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    // Currency
    for (const column of [5, 6, 7]) {
      row.getCell(column).numFmt = CURRENCY_FORMAT;

      row.getCell(column).alignment = {
        horizontal: "right",
        vertical: "middle",
      };
    }

    // Status
    const statusCell = row.getCell(8);

    statusCell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    switch (fine.status) {
      case "pending":
        statusCell.font = {
          name: "Calibri",
          bold: true,
          size: 10,
          color: {
            argb: AMBER,
          },
        };

        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: AMBER_LIGHT,
          },
        };
        break;

      case "partially_deducted":
        statusCell.font = {
          name: "Calibri",
          bold: true,
          size: 10,
          color: {
            argb: AMBER,
          },
        };

        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: AMBER_LIGHT,
          },
        };
        break;

      case "fully_deducted":
        statusCell.font = {
          name: "Calibri",
          bold: true,
          size: 10,
          color: {
            argb: GREEN,
          },
        };

        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: GREEN_LIGHT,
          },
        };
        break;

      case "cancelled":
        statusCell.font = {
          name: "Calibri",
          bold: true,
          size: 10,
          color: {
            argb: RED,
          },
        };

        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: RED_LIGHT,
          },
        };
        break;
    }
  });

  // =========================================================
  // TOTAL ROW
  // =========================================================

  const lastDataRow = 7 + fines.length;

  if (fines.length > 0) {
    const totalRow = worksheet.addRow([
      "",
      "",
      "",
      "TOTAL",
      totalAmount,
      totalDeducted,
      totalOutstanding,
      "",
    ]);

    totalRow.height = 26;

    totalRow.eachCell((cell) => {
      cell.font = {
        name: "Calibri",
        bold: true,
        size: 10,
        color: {
          argb: SLATE_900,
        },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: SLATE_100,
        },
      };

      cell.border = {
        top: {
          style: "medium",
          color: {
            argb: PRIMARY,
          },
        },
        bottom: {
          style: "thin",
          color: {
            argb: SLATE_200,
          },
        },
      };
    });

    totalRow.getCell(4).alignment = {
      horizontal: "right",
      vertical: "middle",
    };

    for (const column of [5, 6, 7]) {
      totalRow.getCell(column).numFmt = CURRENCY_FORMAT;

      totalRow.getCell(column).alignment = {
        horizontal: "right",
        vertical: "middle",
      };
    }
  }

  // =========================================================
  // COLUMN WIDTHS
  // =========================================================

  worksheet.columns = [
    {
      key: "employeeId",
      width: 16,
    },
    {
      key: "employeeName",
      width: 24,
    },
    {
      key: "fatherName",
      width: 24,
    },
    {
      key: "fineDate",
      width: 17,
    },
    {
      key: "amount",
      width: 19,
    },
    {
      key: "deducted",
      width: 19,
    },
    {
      key: "remaining",
      width: 20,
    },
    {
      key: "status",
      width: 22,
    },
  ];

  // =========================================================
  // AUTO FILTER
  // =========================================================

  worksheet.autoFilter = {
    from: "A7",
    to: `H${lastDataRow}`,
  };

  // =========================================================
  // PRINT AREA
  // =========================================================

  const printLastRow = fines.length > 0 ? lastDataRow + 1 : 7;

  worksheet.pageSetup.printArea = `A1:H${printLastRow}`;

  // =========================================================
  // HEADER / FOOTER
  // =========================================================

  worksheet.headerFooter.oddFooter =
    "&LSecurity Management System" +
    "&CPage &P of &N" +
    `&RGenerated ${new Date().toLocaleDateString("en-PK")}`;

  // =========================================================
  // FILE
  // =========================================================

  const date = new Date().toISOString().slice(0, 10);

  const fileName = `fine-report-${date}.xlsx`;

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, fileName);
}
