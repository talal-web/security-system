import test from "node:test";
import assert from "node:assert/strict";

import { getSalaryForPayrollMonth } from "../src/services/employeeSalary.service.js";

test("getSalaryForPayrollMonth returns the latest salary effective on or before the payroll month", async () => {
  const records = [
    {
      employee: "emp-1",
      monthlySalary: 40000,
      effectiveFrom: new Date("2025-01-01T00:00:00.000Z"),
    },
    {
      employee: "emp-1",
      monthlySalary: 50000,
      effectiveFrom: new Date("2025-05-01T00:00:00.000Z"),
    },
    {
      employee: "emp-1",
      monthlySalary: 65000,
      effectiveFrom: new Date("2025-08-01T00:00:00.000Z"),
    },
    {
      employee: "emp-2",
      monthlySalary: 30000,
      effectiveFrom: new Date("2025-08-01T00:00:00.000Z"),
    },
  ];

  const result = await getSalaryForPayrollMonth("emp-1", 2025, 8, async () => {
    return records
      .filter(
        (record) =>
          record.employee === "emp-1" &&
          record.effectiveFrom <= new Date(Date.UTC(2025, 7, 1)),
      )
      .sort((a, b) => b.effectiveFrom - a.effectiveFrom)[0];
  });

  assert.deepEqual(result, {
    employee: "emp-1",
    monthlySalary: 65000,
    effectiveFrom: new Date("2025-08-01T00:00:00.000Z"),
  });
});

test("getSalaryForPayrollMonth returns null when no salary exists before the payroll month", async () => {
  const result = await getSalaryForPayrollMonth(
    "emp-3",
    2025,
    4,
    async () => null,
  );
  assert.equal(result, null);
});
