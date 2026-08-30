import EmployeeSalary from "../models/EmployeeSalary.js";

export const getFirstDayOfPayrollMonth = (year, month) => {
  if (!Number.isInteger(year) || !Number.isInteger(month)) {
    return null;
  }

  if (month < 1 || month > 12) {
    return null;
  }

  return new Date(Date.UTC(year, month - 1, 1));
};

export const getSalaryForPayrollMonth = async (
  employeeId,
  year,
  month,
  queryFn,
) => {
  if (!employeeId) {
    return null;
  }

  const payrollMonthStart = getFirstDayOfPayrollMonth(year, month);

  if (!payrollMonthStart) {
    return null;
  }

  const runQuery =
    queryFn ||
    (async () =>
      EmployeeSalary.findOne({
        employee: employeeId,
        effectiveFrom: { $lte: payrollMonthStart },
      })
        .sort({ effectiveFrom: -1 })
        .lean());

  const salary = await runQuery({
    employeeId,
    payrollMonthStart,
  });

  return salary && typeof salary.toObject === "function"
    ? salary.toObject()
    : salary;
};
