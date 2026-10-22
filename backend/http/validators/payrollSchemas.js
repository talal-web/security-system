// http/validators/payrollSchemas.js
//
// Request-shape validation for the payroll routes. This only checks that
// the request is well-formed. It does NOT check anything that requires
// database state (employee/payroll existence, area-scope matching, or
// payroll status rules) - those remain business rules owned by
// PayrollService/PayrollQueryService.

import { z } from "zod";

import { objectIdString } from "./common.js";

const payrollYear = z.coerce
  .number({ message: "Invalid year" })
  .int("Invalid year")
  .min(2000, "Invalid year")
  .max(2100, "Invalid year");

const payrollMonth = z.coerce
  .number({ message: "Invalid month" })
  .int("Invalid month")
  .min(1, "Invalid month")
  .max(12, "Invalid month");

export const generatePayrollSchema = z
  .object({
    employeeId: objectIdString("Valid employeeId is required"),
    year: payrollYear,
    month: payrollMonth,
  })
  .loose();

export const payrollPeriodSchema = z
  .object({
    year: payrollYear,
    month: payrollMonth,
  })
  .loose();

export const markPayrollPaidSchema = z
  .object({
    paymentMethod: z.enum(["cash", "bank_transfer", "other"], {
      message: "A valid payment method is required",
    }),
    paymentReference: z.string().trim().min(1, "A payment reference is required"),
  })
  .loose();
