// http/validators/invoiceSchemas.js
//
// Request-shape validation for invoices. Database checks (duplicate invoice
// number, invoice status) are left to InvoiceService.

import { z } from "zod";

const isoDate = (label) =>
  z
    .string({ message: `${label} is required` })
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, `${label} must be a valid date (YYYY-MM-DD)`);

const text = (label, max, { required = true } = {}) => {
  const base = z.string({ message: `${label} is required` }).trim();
  const withLength = required
    ? base.min(1, `${label} is required`).max(max, `${label} is too long`)
    : base.max(max, `${label} is too long`);
  return withLength;
};

const optionalText = (label, max) =>
  z
    .string()
    .trim()
    .max(max, `${label} is too long`)
    .optional()
    .default("");

export const createInvoiceSchema = z
  .object({
    invoiceNumber: text("Invoice number", 50),
    invoiceDate: isoDate("Invoice date"),
    serviceFrom: isoDate("Service start date"),
    serviceTo: isoDate("Service end date"),
    dueDate: isoDate("Due date"),

    clientName: text("Client name", 200),
    preparedBy: optionalText("Prepared by", 200),

    description: text("Service description", 1000),

    amount: z.coerce
      .number({ message: "Amount must be a number" })
      .positive("Amount must be greater than zero")
      .max(1_000_000_000_000, "Amount is too large"),

    notes: optionalText("Notes", 2000),

    bankName: optionalText("Bank name", 200),
    accountTitle: optionalText("Account title", 200),
    accountNumber: optionalText("Account number", 100),
    iban: optionalText("IBAN", 100),
  })
  .refine((data) => data.serviceTo >= data.serviceFrom, {
    message: "Service end date cannot be before the start date",
    path: ["serviceTo"],
  });

export const confirmInvoicePaymentSchema = z
  .object({
    paymentMethod: z.enum(["cash", "bank_transfer", "other"], {
      message: "A valid payment method is required",
    }),
    paymentReference: z
      .string({ message: "A payment reference is required" })
      .trim()
      .min(1, "A payment reference is required")
      .max(200, "Payment reference is too long"),
    paidOn: isoDate("Payment date").optional(),
  })
  .loose();
