// http/validators/employeeSalarySchemas.js
//
// Request-shape validation for the employee-salary routes. This only
// checks that the request is well-formed. It does NOT check anything that
// requires database state (employee existence/area scope, duplicate
// effective-month records, or the initial_salary reason rules) - those
// remain business rules owned by EmployeeSalaryService.

import { z } from "zod";

import { objectIdString, optionalObjectId } from "./common.js";

const REASONS = [
  "initial_salary",
  "salary_increase",
  "salary_decrease",
  "promotion",
  "designation_change",
  "other",
];

const effectiveFromDate = (message) =>
  z.coerce.date({ message }).refine((date) => date.getUTCDate() === 1, {
    message: "Salary effective date must be the first day of a month",
  });

export const createEmployeeSalarySchema = z
  .object({
    employee: objectIdString("Valid employee ID is required"),

    monthlySalary: z.coerce
      .number({
        message: "Monthly salary must be a valid non-negative number",
      })
      .min(0, "Monthly salary must be a valid non-negative number"),

    effectiveFrom: effectiveFromDate("Valid effective date is required"),
    reason: z.enum(REASONS, { message: "Invalid salary change reason" }).optional(),
    notes: z.string().optional(),

    // Sent by the frontend alongside the selected area; EmployeeSalaryService
    // checks it against the area scope itself.
    area: optionalObjectId("Invalid area ID"),
  })
  .loose();

export const updateEmployeeSalarySchema = z
  .object({
    monthlySalary: z.coerce
      .number({
        message: "Monthly salary must be a valid non-negative number",
      })
      .min(0, "Monthly salary must be a valid non-negative number")
      .optional(),

    effectiveFrom: effectiveFromDate("Invalid effective date").optional(),
    reason: z.enum(REASONS, { message: "Invalid salary change reason" }).optional(),
    notes: z.string().nullable().optional(),
  })
  // The frontend also sends `area` on update requests, even though
  // EmployeeSalaryService never reads it from the body; let it pass
  // through.
  .loose();
