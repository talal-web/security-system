import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import type { Payroll, PayrollFilters } from "@/types/payroll";

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const CURRENCY_FORMAT = '#,##0" PKR"';

const COLORS = {
  primary: "047857",
  header: "0F172A",
  border: "CBD5E1",
  white: "FFFFFF",
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

function createPayrollDetailsSheet(
  workbook: ExcelJS.Workbook,
  payrolls: Payroll[],
) {
  const worksheet = workbook.addWorksheet("Payroll Details");

  worksheet.columns = [
    { header: "Employee ID", key: "empId", width: 14 },
    { header: "Employee", key: "name", width: 24 },
    { header: "Designation", key: "designation", width: 20 },
    { header: "Period", key: "period", width: 18 },
    { header: "Status", key: "status", width: 13 },

    { header: "Present", key: "present", width: 11 },
    { header: "Leave", key: "leave", width: 10 },
    { header: "Absent", key: "absent", width: 11 },
    { header: "Missing", key: "missing", width: 11 },
    { header: "Payable Days", key: "payable", width: 14 },

    { header: "Monthly Salary", key: "monthly", width: 16 },
    { header: "Daily Salary", key: "daily", width: 14 },
    { header: "Earned Salary", key: "earned", width: 16 },
    { header: "Bonus", key: "bonus", width: 13 },
    { header: "Gross Salary", key: "gross", width: 16 },

    {
      header: "Advance Deduction",
      key: "advance",
      width: 19,
    },
    {
      header: "Fine Deduction",
      key: "fine",
      width: 16,
    },
    {
      header: "Other Deduction",
      key: "other",
      width: 18,
    },
    {
      header: "Total Deductions",
      key: "deductions",
      width: 18,
    },

    { header: "Net Salary", key: "net", width: 15 },

    { header: "Generated", key: "generated", width: 14 },
    { header: "Finalized", key: "finalized", width: 14 },
    { header: "Paid", key: "paid", width: 14 },

    {
      header: "Payment Method",
      key: "paymentMethod",
      width: 18,
    },
    {
      header: "Payment Reference",
      key: "paymentReference",
      width: 24,
    },
  ];

  styleHeader(worksheet.getRow(1));

  payrolls.forEach((payroll) => {
    const employee = getEmployee(payroll);

    worksheet.addRow({
      empId: getEmployeeId(payroll),
      name: getEmployeeName(payroll),
      designation: employee?.designation ?? "-",

      period: formatPeriod(payroll.year, payroll.month),

      status: payroll.status,

      present: payroll.presentDays,
      leave: payroll.leaveDays,
      absent: payroll.absentDays,
      missing: payroll.missingDays,
      payable: payroll.payableDays,

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

      generated: formatDate(payroll.generatedAt),
      finalized: formatDate(payroll.finalizedAt),
      paid: formatDate(payroll.paidAt),

      paymentMethod: formatPaymentMethod(payroll.paymentMethod),

      paymentReference: payroll.paymentReference || "-",
    });
  });

  applyCurrencyFormat(worksheet, [
    11, // Monthly Salary
    12, // Daily Salary
    13, // Earned Salary
    14, // Bonus
    15, // Gross Salary
    16, // Advance Deduction
    17, // Fine Deduction
    18, // Other Deduction
    19, // Total Deductions
    20, // Net Salary
  ]);

  finishSheet(worksheet, "Y");

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
