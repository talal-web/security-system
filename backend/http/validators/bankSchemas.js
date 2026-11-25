// backend/http/validators/bankSchemas.js
//
// Request-shape validation for the bank routes. Business rules (overdraft,
// opening-date window, employee existence) stay in BankService.

import { z } from "zod";

import { objectIdString } from "./common.js";
import { BANK_ENTRY_KIND_VALUES } from "../../src/models/BankEntry.js";

const MAX_AMOUNT = 1_000_000_000_000;

// Money in whole cents, at most two decimal places.
const money = (label) =>
  z.coerce
    .number({ message: `${label} must be a number` })
    .finite(`${label} must be a number`)
    .positive(`${label} must be greater than zero`)
    .max(MAX_AMOUNT, `${label} is too large`)
    .refine(
      (value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-6,
      `${label} can have at most 2 decimal places`,
    );

// "YYYY-MM-DD" becomes a UTC-midnight Date, matching how BankEntry derives `month`.
const dayToDate = (label) =>
  z
    .string({ message: `${label} is required` })
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, `${label} must be a valid date (YYYY-MM-DD)`)
    .transform((value) => new Date(`${value}T00:00:00.000Z`))
    .refine((date) => !Number.isNaN(date.getTime()), `${label} is not a real date`);

const optionalText = (label, max) =>
  z
    .string()
    .trim()
    .max(max, `${label} cannot exceed ${max} characters`)
    .optional();

// Advances and salaries are never entered here. They come from the Advances
// and Payroll pages, so each cash movement has one source of truth.
const MANUAL_KIND_VALUES = BANK_ENTRY_KIND_VALUES.filter(
  (kind) => kind !== "advance" && kind !== "salary",
);

const entryFields = {
  kind: z.enum(MANUAL_KIND_VALUES, {
    message: `Entry type must be one of: ${MANUAL_KIND_VALUES.join(", ")}`,
  }),
  amount: money("Amount"),
  entryDate: dayToDate("Entry date"),
  category: optionalText("Category", 100),
  description: optionalText("Description", 500),
};

export const createBankEntrySchema = z.object({
  kind: entryFields.kind,
  amount: entryFields.amount,
  entryDate: entryFields.entryDate,
  category: entryFields.category,
  description: entryFields.description,
});

export const updateBankEntrySchema = z
  .object({
    kind: entryFields.kind.optional(),
    amount: entryFields.amount.optional(),
    entryDate: entryFields.entryDate.optional(),
    category: entryFields.category,
    description: entryFields.description,
  })
  .refine((data) => Object.keys(data).some((key) => data[key] !== undefined), {
    message: "Nothing to update",
  });

export const updateBankAccountSchema = z
  .object({
    name: optionalText("Account name", 200).refine(
      (value) => value === undefined || value.length > 0,
      "Account name cannot be empty",
    ),
    openingBalance: z.coerce
      .number({ message: "Opening balance must be a number" })
      .finite("Opening balance must be a number")
      .min(0, "Opening balance cannot be negative")
      .max(MAX_AMOUNT, "Opening balance is too large")
      .refine(
        (value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-6,
        "Opening balance can have at most 2 decimal places",
      )
      .optional(),
    openingDate: dayToDate("Opening date").optional(),
  })
  .refine((data) => Object.keys(data).some((key) => data[key] !== undefined), {
    message: "Nothing to update",
  });

const yearField = z.coerce
  .number({ message: "Year must be a number" })
  .int("Year must be a whole number")
  .min(2000, "Year must be 2000 or later")
  .max(2100, "Year must be 2100 or earlier");

export const periodParamsSchema = z.object({
  year: yearField,
  month: z.coerce
    .number({ message: "Month must be a number" })
    .int("Month must be a whole number")
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12"),
});

export const yearParamsSchema = z.object({
  year: yearField,
});

export const auditQuerySchema = z.object({
  entityId: objectIdString("Invalid entity ID").optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
});
