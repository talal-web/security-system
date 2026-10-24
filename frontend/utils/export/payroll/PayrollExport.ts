import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import type { Payroll, PayrollFilters } from "@/types/payroll";

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const CURRENCY_FORMAT = '#,##0" PKR"';

const COLORS = {
  primary: "2563EB",
  header: "0F172A",
  groupHeader: "1E293B",
  border: "CBD5E1",
  white: "FFFFFF",
  zebra: "F8FAFC",
  netSalaryFill: "ECFDF5",
  netSalaryText: "047857",
} as const;

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const getEmployee = (payroll: Payroll) =>
  typeof payroll.employee === "string" ? null : payroll.employee;

const getEmployeeName = (payroll: Payroll) =>
  getEmployee(payroll)?.name ?? "Employee";

const getEmployeeId = (payroll: Payroll) => getEmployee(payroll)?.empId ?? "";

const formatDate = (value: string | null | undefined) =>
  value ? new Date(value).toLocaleDateString("en-PK") : "-";

const formatPeriod = (year: number, month: number) =>
  new Date(year, month - 1).toLocaleString("en", {
    month: "short",
    year: "numeric",
  });

const formatPaymentMethod = (value: Payroll["paymentMethod"]) =>
  value?.replace("_", " ") ?? "-";

// -----------------------------------------------------------------------------
// Worksheet Styling
// -----------------------------------------------------------------------------

function styleHeader(row: ExcelJS.Row) {
  row.height = 24;

  row.font = {
    bold: true,
    color: { argb: COLORS.white },
  };

  row.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.header },
  };

  row.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };
}

function applyBorders(worksheet: ExcelJS.Worksheet) {
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: {
          style: "thin",
          color: { argb: COLORS.border },
        },
        left: {
          style: "thin",
          color: { argb: COLORS.border },
        },
        bottom: {
          style: "thin",
          color: { argb: COLORS.border },
        },
        right: {
          style: "thin",
          color: { argb: COLORS.border },
        },
      };
    });
  });
}

function finishSheet(worksheet: ExcelJS.Worksheet, lastColumn: string) {
  worksheet.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];

  applyBorders(worksheet);

  worksheet.autoFilter = {
    from: "A1",
    to: `${lastColumn}${worksheet.rowCount}`,
  };
}

function applyCurrencyFormat(worksheet: ExcelJS.Worksheet, columns: number[]) {
  columns.forEach((column) => {
    worksheet.getColumn(column).numFmt = CURRENCY_FORMAT;
  });
}

function applyZebraStriping(worksheet: ExcelJS.Worksheet, startRow: number) {
  for (let rowNumber = startRow; rowNumber <= worksheet.rowCount; rowNumber++) {
    if ((rowNumber - startRow) % 2 === 1) {
      worksheet.getRow(rowNumber).eachCell({ includeEmpty: true }, (cell) => {
        if (!cell.fill) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: COLORS.zebra },
          };
        }
      });
    }
  }
}

function styleGroupHeaderCell(cell: ExcelJS.Cell) {
  cell.font = {
    bold: true,
    size: 10,
    color: { argb: COLORS.white },
  };

  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.groupHeader },
  };

  cell.alignment = {
    vertical: "middle",
    horizontal: "center",
  };
}

// -----------------------------------------------------------------------------
// Overview Sheet
// -----------------------------------------------------------------------------

function createOverviewSheet(
  workbook: ExcelJS.Workbook,
  payrolls: Payroll[],
  filters: PayrollFilters,
) {
  const worksheet = workbook.addWorksheet("Overview");

  worksheet.columns = [
    {
      width: 27,
    },
    {
      width: 28,
    },
  ];

  const totalNetSalary = payrolls.reduce(
    (total, payroll) => total + payroll.netSalary,
    0,
  );

  const draftCount = payrolls.filter(
    (payroll) => payroll.status === "draft",
  ).length;

  const finalizedCount = payrolls.filter(
    (payroll) => payroll.status === "finalized",
  ).length;

  const paidCount = payrolls.filter(
    (payroll) => payroll.status === "paid",
  ).length;

  // Title
  worksheet.mergeCells("A1:B1");

  const title = worksheet.getCell("A1");

  title.value = "Payroll Report";

  title.font = {
    bold: true,
    size: 18,
    color: { argb: COLORS.white },
  };

  title.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.primary },
  };

  title.alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  worksheet.getRow(1).height = 32;

  // Report information
  worksheet.addRows([
    ["Generated", new Date().toLocaleString("en-PK")],
    ["Selected Year", filters.year ?? "All years"],
    ["Selected Month", filters.month ?? "All months"],
    ["Selected Status", filters.status ?? "All statuses"],
    ["Payroll Records", payrolls.length],
    ["Draft Records", draftCount],
    ["Finalized Records", finalizedCount],
    ["Paid Records", paidCount],
    ["Total Net Payroll", totalNetSalary],
  ]);

  // Styling
  worksheet.getColumn(1).font = {
    bold: true,
  };

  worksheet.getColumn(2).alignment = {
    vertical: "middle",
  };

  worksheet.getCell("B10").numFmt = CURRENCY_FORMAT;

  applyBorders(worksheet);

  return worksheet;
}

// -----------------------------------------------------------------------------
// Payroll Details Sheet
// -----------------------------------------------------------------------------

// Column groups shown as a merged banner row above the real headers.
// Each group's `span` must match the number of columns listed for it below.
const DETAIL_COLUMN_GROUPS = [
  { title: "Employee", span: 3 },
  { title: "Attendance", span: 3 },
  { title: "Earnings", span: 5 },
  { title: "Deductions", span: 4 },
  { title: "Net Pay", span: 1 },
  { title: "Lifecycle", span: 2 },
  { title: "Payment", span: 2 },
] as const;

const NET_SALARY_COLUMN = 16;

function createPayrollDetailsSheet(
  workbook: ExcelJS.Workbook,
  payrolls: Payroll[],
) {
  const worksheet = workbook.addWorksheet("Payroll Details");

  worksheet.columns = [
    { key: "empId", width: 14 },
    { key: "name", width: 24 },
    { key: "designation", width: 20 },

    { key: "present", width: 11 },
    { key: "leave", width: 10 },
    { key: "absent", width: 11 },

    { key: "monthly", width: 15 },
    { key: "daily", width: 13 },
    { key: "earned", width: 15 },
    { key: "bonus", width: 13 },
    { key: "gross", width: 15 },

    { key: "advance", width: 17 },
    { key: "fine", width: 15 },
    { key: "other", width: 16 },
    { key: "deductions", width: 16 },

    { key: "net", width: 16 },

    { key: "finalized", width: 14 },
    { key: "paid", width: 14 },

    { key: "paymentMethod", width: 17 },
    { key: "paymentReference", width: 22 },
  ];

  // Row 1: group banner
  const columnHeaders = [
    "Employee ID",
    "Employee",
    "Designation",
    "Present",
    "Leave",
    "Absent",
    "Monthly Salary",
    "Daily Salary",
    "Earned Salary",
    "Bonus",
    "Gross Salary",
    "Advance Deduction",
    "Fine Deduction",
    "Other Deduction",
    "Total Deductions",
    "Net Salary",
    "Finalized",
    "Paid",
    "Payment Method",
    "Payment Reference",
  ];

  const groupRow = worksheet.getRow(1);
  groupRow.height = 20;

  let columnCursor = 1;

  DETAIL_COLUMN_GROUPS.forEach(({ title, span }) => {
    const startCol = columnCursor;
    const endCol = columnCursor + span - 1;

    if (span > 1) {
      worksheet.mergeCells(1, startCol, 1, endCol);
    }

    const cell = worksheet.getCell(1, startCol);
    cell.value = title;
    styleGroupHeaderCell(cell);

    columnCursor = endCol + 1;
  });

  // Row 2: column headers
  const headerRow = worksheet.getRow(2);
  columnHeaders.forEach((text, index) => {
    headerRow.getCell(index + 1).value = text;
  });
  styleHeader(headerRow);

  payrolls.forEach((payroll) => {
    const employee = getEmployee(payroll);

    worksheet.addRow({
      empId: getEmployeeId(payroll),
      name: getEmployeeName(payroll),
      designation: employee?.designation ?? "-",

      present: payroll.presentDays,
      leave: payroll.leaveDays,
      absent: payroll.absentDays,

      monthly: payroll.monthlySalary,
      daily: payroll.salaryPerDay,
      earned: payroll.earnedSalary,
      bonus: payroll.totalBonus,
      gross: payroll.grossSalary,

      advance: payroll.totalAdvanceDeduction,
      fine: payroll.totalFineDeduction,
      other: payroll.totalOtherDeduction,
      deductions: payroll.totalDeductions,

      net: payroll.netSalary,

      finalized: formatDate(payroll.finalizedAt),
      paid: formatDate(payroll.paidAt),

      paymentMethod: formatPaymentMethod(payroll.paymentMethod),

      paymentReference: payroll.paymentReference || "-",
    });
  });

  applyCurrencyFormat(
    worksheet,
    [7, 8, 9, 10, 11, 12, 13, 14, 15, NET_SALARY_COLUMN],
  );

  ["present", "leave", "absent"].forEach((key) => {
    const column = worksheet.getColumn(key);
    column.alignment = { vertical: "middle", horizontal: "center" };
  });

  worksheet.getColumn("empId").alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  // Emphasize Net Salary as the headline figure of the sheet.
  const netColumn = worksheet.getColumn(NET_SALARY_COLUMN);
  netColumn.eachCell({ includeEmpty: false }, (cell, rowNumber) => {
    if (rowNumber <= 2) return;

    cell.font = { bold: true, color: { argb: COLORS.netSalaryText } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.netSalaryFill },
    };
  });

  applyZebraStriping(worksheet, 3);

  worksheet.views = [{ state: "frozen", ySplit: 2 }];
  applyBorders(worksheet);
  worksheet.autoFilter = {
    from: "A2",
    to: `T${worksheet.rowCount}`,
  };

  return worksheet;
}

// -----------------------------------------------------------------------------
// Bonus & Deductions Sheet
// -----------------------------------------------------------------------------

function createSourcesSheet(workbook: ExcelJS.Workbook, payrolls: Payroll[]) {
  const worksheet = workbook.addWorksheet("Bonus and Deductions");

  worksheet.columns = [
    { header: "Employee ID", key: "empId", width: 14 },
    { header: "Employee", key: "name", width: 24 },
    { header: "Period", key: "period", width: 18 },
    { header: "Type", key: "type", width: 20 },
    { header: "Source ID", key: "source", width: 28 },
    { header: "Amount", key: "amount", width: 15 },
  ];

  styleHeader(worksheet.getRow(1));

  payrolls.forEach((payroll) => {
    const period = formatPeriod(payroll.year, payroll.month);

    const sources = [
      {
        type: "Bonus",
        items: payroll.bonuses,
      },
      {
        type: "Advance deduction",
        items: payroll.advanceDeductions,
      },
      {
        type: "Fine deduction",
        items: payroll.fineDeductions,
      },
      {
        type: "Other deduction",
        items: payroll.otherDeductions,
      },
    ];

    sources.forEach(({ type, items }) => {
      items.forEach((item) => {
        worksheet.addRow({
          empId: getEmployeeId(payroll),
          name: getEmployeeName(payroll),
          period,
          type,
          source: item.source,
          amount: item.amount,
        });
      });
    });
  });

  applyCurrencyFormat(worksheet, [6]);

  applyZebraStriping(worksheet, 2);

  finishSheet(worksheet, "F");

  return worksheet;
}

// -----------------------------------------------------------------------------
// Main Export Function
// -----------------------------------------------------------------------------

export async function exportPayrollsToExcel(
  payrolls: Payroll[],
  filters: PayrollFilters = {},
) {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Security Management System";
  workbook.lastModifiedBy = "Security Management System";
  workbook.created = new Date();
  workbook.modified = new Date();

  createOverviewSheet(workbook, payrolls, filters);

  createPayrollDetailsSheet(workbook, payrolls);

  createSourcesSheet(workbook, payrolls);

  const dateStamp = new Date().toISOString().slice(0, 10);

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `payroll-report-${dateStamp}.xlsx`);
}
