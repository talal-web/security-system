// backend/src/services/payrollService.js

import mongoose from "mongoose";

import Employee from "../../models/Employee.js";
import Payroll from "../../models/Payroll.js";
import Attendance from "../../models/Attendance.js";
import Advance from "../../models/Advance.js";
import Fine from "../../models/Fine.js";
import Deduction from "../../models/Deduction.js";
import Bonus from "../../models/Bonus.js";

import { getSalaryForPayrollMonth } from "./employeeSalary.service.js";

// ============================================================================
// CONSTANTS
// ============================================================================

const ACTIVE_EMPLOYEE_STATUS = "active";

const ADVANCE_OPEN_STATUSES = ["active", "partially_deducted"];
const FINE_OPEN_STATUSES = ["pending", "partially_deducted"];
const DEDUCTION_OPEN_STATUSES = ["pending", "partially_deducted"];

const MONTHLY_PAYROLL_CONCURRENCY = 8;

const ROUND_MONEY = (value) => Math.round(Number(value) || 0);

// ============================================================================
// DATE HELPERS
// ============================================================================

function createUtcDate(year, month, day) {
  return new Date(Date.UTC(year, month - 1, day));
}

function getMonthStart(year, month) {
  return createUtcDate(year, month, 1);
}

function getMonthEnd(year, month) {
  // month is 1-based: January = 1 ... December = 12
  return new Date(Date.UTC(year, month, 0));
}

function formatDateOnly(date) {
  return date.toISOString().slice(0, 10);
}

function getCalendarDays(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function getInclusiveDayCount(startDate, endDate) {
  if (startDate > endDate) {
    return 0;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return (
    Math.floor((endDate.getTime() - startDate.getTime()) / millisecondsPerDay) +
    1
  );
}

function validatePayrollPeriod(year, month) {
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new Error("Invalid payroll year");
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("Invalid payroll month");
  }
}

// ============================================================================
// EMPLOYEE PAYROLL PERIOD
// ============================================================================

function getEmployeePayrollPeriod(employee, year, month) {
  const monthStart = getMonthStart(year, month);
  const monthEnd = getMonthEnd(year, month);

  const employeeEntryDate = employee.entryDate
    ? new Date(employee.entryDate)
    : null;

  const employeeExitDate = employee.exitDate
    ? new Date(employee.exitDate)
    : null;

  let periodStart = monthStart;
  let periodEnd = monthEnd;

  // Joined during the month
  if (employeeEntryDate && employeeEntryDate > periodStart) {
    periodStart = createUtcDate(
      employeeEntryDate.getUTCFullYear(),
      employeeEntryDate.getUTCMonth() + 1,
      employeeEntryDate.getUTCDate(),
    );
  }

  // Exited during the month. Exit date is paid.
  if (employeeExitDate && employeeExitDate < periodEnd) {
    periodEnd = createUtcDate(
      employeeExitDate.getUTCFullYear(),
      employeeExitDate.getUTCMonth() + 1,
      employeeExitDate.getUTCDate(),
    );
  }

  if (periodStart > periodEnd) {
    return null;
  }

  return {
    periodStart,
    periodEnd,
  };
}

// ============================================================================
// ATTENDANCE
// ============================================================================

async function calculateAttendance(employeeId, periodStart, periodEnd) {
  const start = formatDateOnly(periodStart);
  const end = formatDateOnly(periodEnd);

  const attendanceRecords = await Attendance.find({
    employee: employeeId,
    date: {
      $gte: start,
      $lte: end,
    },
  })
    .select("date status")
    .lean();

  const attendanceByDate = new Map();

  for (const record of attendanceRecords) {
    attendanceByDate.set(record.date, record);
  }

  let presentDays = 0;
  let leaveDays = 0;
  let absentDays = 0;
  let missingDays = 0;

  const totalDays = getInclusiveDayCount(periodStart, periodEnd);

  for (let index = 0; index < totalDays; index += 1) {
    const currentDate = new Date(
      periodStart.getTime() + index * 24 * 60 * 60 * 1000,
    );

    const dateKey = formatDateOnly(currentDate);
    const attendance = attendanceByDate.get(dateKey);

    // Missing = unpaid
    if (!attendance) {
      missingDays += 1;
      continue;
    }

    // Present = paid
    if (attendance.status === "present") {
      presentDays += 1;
      continue;
    }

    // Leave = paid
    if (attendance.status === "leave") {
      leaveDays += 1;
      continue;
    }

    // Absent = unpaid
    if (attendance.status === "absent") {
      absentDays += 1;
    }
  }

  const payableDays = presentDays + leaveDays;

  return {
    presentDays,
    leaveDays,
    absentDays,
    missingDays,
    payableDays,
  };
}

// ============================================================================
// BONUS
// ============================================================================

async function getMonthlyBonuses(employeeId, year, month) {
  const monthStart = getMonthStart(year, month);
  const nextMonthStart = createUtcDate(year, month + 1, 1);

  const bonuses = await Bonus.find({
    employee: employeeId,
    bonusDate: {
      $gte: monthStart,
      $lt: nextMonthStart,
    },
    status: "pending",
  })
    .select("_id amount")
    .sort({
      bonusDate: 1,
      createdAt: 1,
      _id: 1,
    })
    .lean();

  const items = bonuses.map((bonus) => ({
    source: bonus._id,
    amount: ROUND_MONEY(bonus.amount),
  }));

  const total = ROUND_MONEY(items.reduce((sum, item) => sum + item.amount, 0));

  return {
    items,
    total,
  };
}

// ============================================================================
// DEDUCTION ALLOCATION
// ============================================================================

function allocateDeductions(records, availableAmount) {
  let remainingAvailable = ROUND_MONEY(availableAmount);

  const deductions = [];

  for (const record of records) {
    if (remainingAvailable <= 0) {
      break;
    }

    const outstanding = ROUND_MONEY(record.remainingAmount);

    if (outstanding <= 0) {
      continue;
    }

    const deductionAmount = Math.min(remainingAvailable, outstanding);

    if (deductionAmount <= 0) {
      continue;
    }

    deductions.push({
      source: record._id,
      amount: ROUND_MONEY(deductionAmount),
    });

    remainingAvailable = ROUND_MONEY(remainingAvailable - deductionAmount);
  }

  return {
    deductions,
    remainingAvailable,
  };
}

// ============================================================================
// FETCH OPEN DEDUCTIONS
// ============================================================================

async function getOpenAdvances(employeeId) {
  return Advance.find({
    employee: employeeId,
    status: {
      $in: ADVANCE_OPEN_STATUSES,
    },
    remainingAmount: {
      $gt: 0,
    },
  })
    .select("_id amount remainingAmount advanceDate createdAt")
    .sort({
      advanceDate: 1,
      createdAt: 1,
      _id: 1,
    })
    .lean();
}

async function getOpenFines(employeeId) {
  return Fine.find({
    employee: employeeId,
    status: {
      $in: FINE_OPEN_STATUSES,
    },
    remainingAmount: {
      $gt: 0,
    },
  })
    .select("_id amount remainingAmount fineDate createdAt")
    .sort({
      fineDate: 1,
      createdAt: 1,
      _id: 1,
    })
    .lean();
}

async function getOpenOtherDeductions(employeeId) {
  return Deduction.find({
    employee: employeeId,
    status: {
      $in: DEDUCTION_OPEN_STATUSES,
    },
    remainingAmount: {
      $gt: 0,
    },
  })
    .select("_id amount remainingAmount deductionDate createdAt")
    .sort({
      deductionDate: 1,
      createdAt: 1,
      _id: 1,
    })
    .lean();
}

// ============================================================================
// BUILD PAYROLL CALCULATION
// ============================================================================

async function calculatePayroll({ employee, year, month }) {
  validatePayrollPeriod(year, month);

  const payrollPeriod = getEmployeePayrollPeriod(employee, year, month);

  if (!payrollPeriod) {
    return null;
  }

  const { periodStart, periodEnd } = payrollPeriod;

  // These operations are independent, so run them in parallel.
  const [salary, attendance, bonusData, advances, fines, otherDeductions] =
    await Promise.all([
      getSalaryForPayrollMonth(employee._id, year, month),
      calculateAttendance(employee._id, periodStart, periodEnd),
      getMonthlyBonuses(employee._id, year, month),
      getOpenAdvances(employee._id),
      getOpenFines(employee._id),
      getOpenOtherDeductions(employee._id),
    ]);

  if (!salary) {
    throw new Error(
      `No salary record found for employee ${employee.empId || employee._id}`,
    );
  }

  const calendarDays = getCalendarDays(year, month);

  const monthlySalary = ROUND_MONEY(salary.monthlySalary);

  // Keep the daily rate precise for calculation.
  const salaryPerDay = calendarDays > 0 ? monthlySalary / calendarDays : 0;

  const earnedSalary = ROUND_MONEY(salaryPerDay * attendance.payableDays);

  const grossSalary = ROUND_MONEY(earnedSalary + bonusData.total);

  // ==========================================================================
  // DEDUCTIONS
  // ==========================================================================

  let availableForDeduction = grossSalary;

  // 1. Advance
  const advanceAllocation = allocateDeductions(advances, availableForDeduction);

  availableForDeduction = advanceAllocation.remainingAvailable;

  const totalAdvanceDeduction = ROUND_MONEY(
    advanceAllocation.deductions.reduce((sum, item) => sum + item.amount, 0),
  );

  // 2. Fine
  const fineAllocation = allocateDeductions(fines, availableForDeduction);

  availableForDeduction = fineAllocation.remainingAvailable;

  const totalFineDeduction = ROUND_MONEY(
    fineAllocation.deductions.reduce((sum, item) => sum + item.amount, 0),
  );

  // 3. Other deduction
  const otherDeductionAllocation = allocateDeductions(
    otherDeductions,
    availableForDeduction,
  );

  const totalOtherDeduction = ROUND_MONEY(
    otherDeductionAllocation.deductions.reduce(
      (sum, item) => sum + item.amount,
      0,
    ),
  );

  const totalDeductions = ROUND_MONEY(
    totalAdvanceDeduction + totalFineDeduction + totalOtherDeduction,
  );

  const netSalary = ROUND_MONEY(Math.max(0, grossSalary - totalDeductions));

  return {
    employee: employee._id,

    year,
    month,

    periodStart,
    periodEnd,

    monthlySalary,

    salaryEffectiveFrom: salary.effectiveFrom,

    calendarDays,

    payableDays: attendance.payableDays,

    presentDays: attendance.presentDays,
    leaveDays: attendance.leaveDays,
    absentDays: attendance.absentDays,
    missingDays: attendance.missingDays,

    salaryPerDay,
    earnedSalary,

    bonuses: bonusData.items,
    totalBonus: bonusData.total,

    grossSalary,

    advanceDeductions: advanceAllocation.deductions,
    fineDeductions: fineAllocation.deductions,
    otherDeductions: otherDeductionAllocation.deductions,

    totalAdvanceDeduction,
    totalFineDeduction,
    totalOtherDeduction,

    totalDeductions,
    netSalary,
  };
}

// ============================================================================
// GENERATE PAYROLL FOR ONE EMPLOYEE
// ============================================================================

export async function generatePayrollForEmployee({
  employeeId,
  year,
  month,
  userId,
  payrollId = null,
  recalculate = false,
  employee: providedEmployee = null,
}) {
  validatePayrollPeriod(year, month);

  if (!mongoose.isValidObjectId(employeeId)) {
    throw new Error("Invalid employee ID");
  }

  // Reuse already-loaded employee when monthly generation provides it.
  const employee =
    providedEmployee ||
    (await Employee.findById(employeeId)
      .select("_id empId name fatherName designation status entryDate exitDate")
      .lean());

  if (!employee) {
    throw new Error("Employee not found");
  }

  const calculation = await calculatePayroll({
    employee,
    year,
    month,
  });

  if (!calculation) {
    throw new Error("Employee was not eligible for payroll during this month");
  }

  // ==========================================================================
  // RECALCULATE EXISTING DRAFT
  // ==========================================================================

  if (payrollId) {
    const payroll = await Payroll.findById(payrollId);

    if (!payroll) {
      throw new Error("Payroll not found");
    }

    if (payroll.status !== "draft") {
      throw new Error("Only draft payroll can be recalculated");
    }

    Object.assign(payroll, calculation);

    payroll.status = "draft";
    payroll.generatedAt = new Date();

    await payroll.save();

    return payroll;
  }

  // ==========================================================================
  // CHECK EXISTING PAYROLL
  // ==========================================================================

  const existingPayroll = await Payroll.findOne({
    employee: employee._id,
    year,
    month,
  });

  if (existingPayroll) {
    if (!recalculate) {
      throw new Error("Payroll already exists for this employee and month");
    }

    if (existingPayroll.status !== "draft") {
      throw new Error("Only draft payroll can be recalculated");
    }

    Object.assign(existingPayroll, calculation);

    existingPayroll.status = "draft";
    existingPayroll.generatedAt = new Date();

    await existingPayroll.save();

    return existingPayroll;
  }

  // ==========================================================================
  // CREATE NEW PAYROLL
  // ==========================================================================

  const payroll = await Payroll.create({
    ...calculation,
    status: "draft",
    generatedAt: new Date(),
  });

  return payroll;
}

// ============================================================================
// RUN AS CONTROLLED CONCURRENCY
// ============================================================================

async function runWithConcurrency(items, worker, concurrency) {
  const results = [];
  let nextIndex = 0;

  async function workerLoop() {
    while (true) {
      const currentIndex = nextIndex;

      if (currentIndex >= items.length) {
        return;
      }

      nextIndex += 1;

      results[currentIndex] = await worker(items[currentIndex]);
    }
  }

  const workerCount = Math.min(concurrency, items.length);

  await Promise.all(Array.from({ length: workerCount }, () => workerLoop()));

  return results;
}

// ============================================================================
// GENERATE PAYROLL FOR ALL ELIGIBLE EMPLOYEES
// ============================================================================

export async function generatePayrollForMonth({ year, month, userId }) {
  validatePayrollPeriod(year, month);

  const monthStart = getMonthStart(year, month);

  // ==========================================================================
  // FETCH EMPLOYEES ONCE
  // ==========================================================================

  const employees = await Employee.find({
    $or: [
      {
        status: ACTIVE_EMPLOYEE_STATUS,
      },
      {
        entryDate: {
          $exists: true,
        },
        exitDate: {
          $gte: monthStart,
        },
      },
    ],
  })
    .select("_id empId name fatherName designation status entryDate exitDate")
    .sort({
      empId: 1,
    })
    .lean();

  // ==========================================================================
  // FETCH EXISTING PAYROLLS ONCE
  // ==========================================================================

  const existingPayrolls = await Payroll.find({
    year,
    month,
    employee: {
      $in: employees.map((employee) => employee._id),
    },
  })
    .select("_id employee status")
    .lean();

  const existingPayrollByEmployee = new Map();

  for (const payroll of existingPayrolls) {
    existingPayrollByEmployee.set(String(payroll.employee), payroll);
  }

  const result = {
    year,
    month,
    totalEmployees: employees.length,
    generated: 0,
    skipped: 0,
    failed: 0,
    payrollIds: [],
    errors: [],
  };

  // ==========================================================================
  // PRE-CHECK ELIGIBILITY
  // ==========================================================================

  const employeesToGenerate = [];

  for (const employee of employees) {
    const period = getEmployeePayrollPeriod(employee, year, month);

    if (!period) {
      result.skipped += 1;
      continue;
    }

    const existingPayroll = existingPayrollByEmployee.get(String(employee._id));

    if (existingPayroll) {
      result.skipped += 1;
      continue;
    }

    employeesToGenerate.push(employee);
  }

  // ==========================================================================
  // GENERATE IN CONTROLLED PARALLEL BATCHES
  // ==========================================================================

  await runWithConcurrency(
    employeesToGenerate,
    async (employee) => {
      try {
        const payroll = await generatePayrollForEmployee({
          employeeId: employee._id,
          year,
          month,
          userId,
          employee,
        });

        result.generated += 1;
        result.payrollIds.push(payroll._id);

        return payroll;
      } catch (error) {
        result.failed += 1;

        result.errors.push({
          employeeId: employee._id,
          empId: employee.empId,
          name: employee.name,
          message: error.message,
        });

        return null;
      }
    },
    MONTHLY_PAYROLL_CONCURRENCY,
  );

  return result;
}

// ============================================================================
// FINALIZE PAYROLL
// ============================================================================

export async function finalizePayrollById({ payrollId, userId }) {
  if (!mongoose.isValidObjectId(payrollId)) {
    throw new Error("Invalid payroll ID");
  }

  const session = await mongoose.startSession();

  try {
    let finalizedPayroll;

    await session.withTransaction(async () => {
      const payroll = await Payroll.findById(payrollId).session(session);

      if (!payroll) {
        throw new Error("Payroll not found");
      }

      if (payroll.status !== "draft") {
        throw new Error("Only draft payroll can be finalized");
      }

      // ======================================================================
      // APPLY ADVANCE DEDUCTIONS
      // ======================================================================

      for (const item of payroll.advanceDeductions) {
        const advance = await Advance.findById(item.source).session(session);

        if (!advance) {
          throw new Error(`Advance ${item.source} no longer exists`);
        }

        const deductionAmount = ROUND_MONEY(item.amount);

        if (deductionAmount <= 0) {
          continue;
        }

        if (deductionAmount > ROUND_MONEY(advance.remainingAmount)) {
          throw new Error(
            `Advance ${item.source} has insufficient remaining balance`,
          );
        }

        advance.remainingAmount = ROUND_MONEY(
          advance.remainingAmount - deductionAmount,
        );

        advance.status =
          advance.remainingAmount === 0
            ? "fully_deducted"
            : "partially_deducted";

        advance.updatedBy = userId;

        await advance.save({
          session,
        });
      }

      // ======================================================================
      // APPLY FINE DEDUCTIONS
      // ======================================================================

      for (const item of payroll.fineDeductions) {
        const fine = await Fine.findById(item.source).session(session);

        if (!fine) {
          throw new Error(`Fine ${item.source} no longer exists`);
        }

        const deductionAmount = ROUND_MONEY(item.amount);

        if (deductionAmount <= 0) {
          continue;
        }

        if (deductionAmount > ROUND_MONEY(fine.remainingAmount)) {
          throw new Error(
            `Fine ${item.source} has insufficient remaining balance`,
          );
        }

        fine.remainingAmount = ROUND_MONEY(
          fine.remainingAmount - deductionAmount,
        );

        fine.status =
          fine.remainingAmount === 0 ? "fully_deducted" : "partially_deducted";

        fine.updatedBy = userId;

        await fine.save({
          session,
        });
      }

      // ======================================================================
      // APPLY OTHER DEDUCTIONS
      // ======================================================================

      for (const item of payroll.otherDeductions) {
        const deduction = await Deduction.findById(item.source).session(
          session,
        );

        if (!deduction) {
          throw new Error(`Deduction ${item.source} no longer exists`);
        }

        const deductionAmount = ROUND_MONEY(item.amount);

        if (deductionAmount <= 0) {
          continue;
        }

        if (deductionAmount > ROUND_MONEY(deduction.remainingAmount)) {
          throw new Error(
            `Deduction ${item.source} has insufficient remaining balance`,
          );
        }

        deduction.remainingAmount = ROUND_MONEY(
          deduction.remainingAmount - deductionAmount,
        );

        deduction.status =
          deduction.remainingAmount === 0
            ? "fully_deducted"
            : "partially_deducted";

        deduction.updatedBy = userId;

        await deduction.save({
          session,
        });
      }

      // ======================================================================
      // MARK BONUSES AS PAID
      // ======================================================================

      for (const item of payroll.bonuses) {
        const bonus = await Bonus.findById(item.source).session(session);

        if (!bonus) {
          throw new Error(`Bonus ${item.source} no longer exists`);
        }

        if (bonus.status !== "pending") {
          throw new Error(`Bonus ${item.source} is no longer pending`);
        }

        bonus.status = "paid";
        bonus.updatedBy = userId;

        await bonus.save({
          session,
        });
      }

      // ======================================================================
      // FINALIZE
      // ======================================================================

      payroll.status = "finalized";
      payroll.finalizedAt = new Date();
      payroll.finalizedBy = userId;

      await payroll.save({
        session,
      });

      finalizedPayroll = payroll;
    });

    return finalizedPayroll;
  } finally {
    await session.endSession();
  }
}

// ============================================================================
// MARK PAYROLL AS PAID
// ============================================================================

export async function markPayrollPaid({
  payrollId,
  userId,
  paymentMethod,
  paymentReference,
}) {
  if (!mongoose.isValidObjectId(payrollId)) {
    throw new Error("Invalid payroll ID");
  }

  const payroll = await Payroll.findById(payrollId);

  if (!payroll) {
    throw new Error("Payroll not found");
  }

  if (payroll.status !== "finalized") {
    throw new Error("Only finalized payroll can be marked as paid");
  }

  const allowedMethods = ["cash", "bank_transfer", "other"];

  if (!allowedMethods.includes(paymentMethod)) {
    throw new Error("A valid payment method is required");
  }

  if (typeof paymentReference !== "string" || !paymentReference.trim()) {
    throw new Error("A payment reference is required");
  }

  payroll.paymentMethod = paymentMethod;
  payroll.paymentReference = paymentReference.trim();

  payroll.status = "paid";
  payroll.paidAt = new Date();
  payroll.paidBy = userId;

  await payroll.save();

  return payroll;
}
