import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import type { Bonus, BonusFilters, BonusStatus } from "@/types/bonus";

// =========================================================
// EMPLOYEE HELPERS
// =========================================================

function getEmployeeId(bonus: Bonus): string {
  if (typeof bonus.employee === "string") {
    return bonus.employee;
  }

  return bonus.employee?.empId ?? "-";
}

function getEmployeeName(bonus: Bonus): string {
  if (typeof bonus.employee === "string") {
    return "-";
  }

  return bonus.employee?.name ?? "-";
}

function getFatherName(bonus: Bonus): string {
  if (typeof bonus.employee === "string") {
    return "-";
  }

  return bonus.employee?.fatherName ?? "-";
}

function getDesignation(bonus: Bonus): string {
  if (typeof bonus.employee === "string") {
    return "-";
  }

  return bonus.employee?.designation ?? "-";
}

// =========================================================
// DATE
// =========================================================

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

// =========================================================
// STATUS
// =========================================================

function getStatusLabel(status: BonusStatus): string {
  switch (status) {
    case "pending":
      return "Pending";

    case "paid":
      return "Paid";

    case "cancelled":
      return "Cancelled";

    default:
      return status;
  }
}

// =========================================================
// FILTER DESCRIPTION
// =========================================================

function getFilterDescription(filters: BonusFilters): string {
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

// =========================================================
// SUMMARY
// =========================================================

function getBonusSummary(bonuses: Bonus[]) {
  const uniqueEmployees = new Set(
    bonuses.map((bonus) =>
      typeof bonus.employee === "string" ? bonus.employee : bonus.employee?._id,
    ),
  ).size;

  const totalAmount = bonuses.reduce((total, bonus) => total + bonus.amount, 0);

  const pendingAmount = bonuses
    .filter((bonus) => bonus.status === "pending")
    .reduce((total, bonus) => total + bonus.amount, 0);

  const paidAmount = bonuses
    .filter((bonus) => bonus.status === "paid")
    .reduce((total, bonus) => total + bonus.amount, 0);

  const cancelledAmount = bonuses
    .filter((bonus) => bonus.status === "cancelled")
    .reduce((total, bonus) => total + bonus.amount, 0);

  return {
    uniqueEmployees,
    totalAmount,
    pendingAmount,
    paidAmount,
    cancelledAmount,
  };
}

// =========================================================
// EXPORT
// =========================================================

export async function exportBonusesToExcel(
  bonuses: Bonus[],
  filters: BonusFilters = {},
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

  const {
    uniqueEmployees,
    totalAmount,
    pendingAmount,
    paidAmount,
    cancelledAmount,
  } = getBonusSummary(bonuses);

  // =========================================================
  // WORKSHEET
  // =========================================================

  const worksheet = workbook.addWorksheet("Bonus Report", {
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

  worksheet.mergeCells("A1:J1");

  const titleCell = worksheet.getCell("A1");

  titleCell.value = "EMPLOYEE BONUS REPORT";

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

  worksheet.mergeCells("A2:J2");

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

  worksheet.mergeCells("A3:J3");

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
      label: "Total Bonuses",
      value: totalAmount,
      labelCell: "C5",
      valueCell: "D5",
      fill: BLUE_LIGHT,
      valueFormat: CURRENCY_FORMAT,
    },
    {
      label: "Pending",
      value: pendingAmount,
      labelCell: "E5",
      valueCell: "F5",
      fill: AMBER_LIGHT,
      valueFormat: CURRENCY_FORMAT,
    },
    {
      label: "Paid",
      value: paidAmount,
      labelCell: "G5",
      valueCell: "H5",
      fill: GREEN_LIGHT,
      valueFormat: CURRENCY_FORMAT,
    },
    {
      label: "Cancelled",
      value: cancelledAmount,
      labelCell: "I5",
      valueCell: "J5",
      fill: RED_LIGHT,
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
    "Designation",
    "Bonus Date",
    "Bonus Amount",
    "Reason",
    "Status",
    "Created By",
    "Updated By",
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

  bonuses.forEach((bonus, index) => {
    const createdBy =
      typeof bonus.createdBy === "string"
        ? bonus.createdBy
        : (bonus.createdBy?.name ?? "-");

    const updatedBy =
      typeof bonus.updatedBy === "string"
        ? bonus.updatedBy
        : (bonus.updatedBy?.name ?? "-");

    const row = worksheet.addRow([
      getEmployeeId(bonus),
      getEmployeeName(bonus),
      getFatherName(bonus),
      getDesignation(bonus),
      formatDate(bonus.bonusDate),
      bonus.amount,
      bonus.reason || "-",
      getStatusLabel(bonus.status),
      createdBy,
      updatedBy,
    ]);

    row.height = 24;

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

    // Bonus Date
    row.getCell(5).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    // Amount
    row.getCell(6).numFmt = CURRENCY_FORMAT;

    row.getCell(6).alignment = {
      horizontal: "right",
      vertical: "middle",
    };

    // Reason
    row.getCell(7).alignment = {
      horizontal: "left",
      vertical: "middle",
      wrapText: true,
    };

    // Status
    const statusCell = row.getCell(8);

    statusCell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    switch (bonus.status) {
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

      case "paid":
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

  const lastDataRow = 7 + bonuses.length;

  if (bonuses.length > 0) {
    const totalRow = worksheet.addRow([
      "",
      "",
      "",
      "",
      "TOTAL",
      totalAmount,
      "",
      "",
      "",
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

    totalRow.getCell(5).alignment = {
      horizontal: "right",
      vertical: "middle",
    };

    totalRow.getCell(6).numFmt = CURRENCY_FORMAT;

    totalRow.getCell(6).alignment = {
      horizontal: "right",
      vertical: "middle",
    };
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
      key: "designation",
      width: 20,
    },
    {
      key: "bonusDate",
      width: 17,
    },
    {
      key: "amount",
      width: 19,
    },
    {
      key: "reason",
      width: 32,
    },
    {
      key: "status",
      width: 18,
    },
    {
      key: "createdBy",
      width: 20,
    },
    {
      key: "updatedBy",
      width: 20,
    },
  ];

  // =========================================================
  // AUTO FILTER
  // =========================================================

  worksheet.autoFilter = {
    from: "A7",
    to: `J${lastDataRow}`,
  };

  // =========================================================
  // PRINT AREA
  // =========================================================

  const printLastRow = bonuses.length > 0 ? lastDataRow + 1 : 7;

  worksheet.pageSetup.printArea = `A1:J${printLastRow}`;

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

  const fileName = `bonus-report-${date}.xlsx`;

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, fileName);
}
