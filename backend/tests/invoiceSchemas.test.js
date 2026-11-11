import test from "node:test";
import assert from "node:assert/strict";

import {
  createInvoiceSchema,
  confirmInvoicePaymentSchema,
} from "../http/validators/invoiceSchemas.js";

const validInvoice = () => ({
  invoiceNumber: "TJNEX-2026-001",
  invoiceDate: "2026-08-01",
  serviceFrom: "2026-08-01",
  serviceTo: "2026-08-31",
  dueDate: "2026-08-07",
  clientName: "Client Name",
  preparedBy: "",
  description: "Technical support",
  amount: "12000",
  notes: "",
  bankName: "",
  accountTitle: "",
  accountNumber: "",
  iban: "",
});

test("createInvoiceSchema accepts a well-formed invoice and coerces amount", () => {
  const result = createInvoiceSchema.safeParse(validInvoice());

  assert.equal(result.success, true);
  assert.equal(result.data.amount, 12000);
});

test("createInvoiceSchema rejects a zero or negative amount", () => {
  for (const amount of [0, -5, "0"]) {
    const result = createInvoiceSchema.safeParse({ ...validInvoice(), amount });
    assert.equal(result.success, false, `amount ${amount} should be rejected`);
  }
});

test("createInvoiceSchema rejects a missing client name", () => {
  const result = createInvoiceSchema.safeParse({
    ...validInvoice(),
    clientName: "   ",
  });

  assert.equal(result.success, false);
  assert.match(result.error.issues[0].message, /Client name is required/);
});

test("createInvoiceSchema rejects a malformed date", () => {
  const result = createInvoiceSchema.safeParse({
    ...validInvoice(),
    dueDate: "07/08/2026",
  });

  assert.equal(result.success, false);
  assert.match(result.error.issues[0].message, /Due date must be a valid date/);
});

test("createInvoiceSchema rejects a service end before the start", () => {
  const result = createInvoiceSchema.safeParse({
    ...validInvoice(),
    serviceFrom: "2026-08-31",
    serviceTo: "2026-08-01",
  });

  assert.equal(result.success, false);
  assert.match(result.error.issues[0].message, /cannot be before the start/);
});

test("createInvoiceSchema fills optional text fields with empty strings", () => {
  const { preparedBy, notes, ...rest } = validInvoice();
  const result = createInvoiceSchema.safeParse(rest);

  assert.equal(result.success, true);
  assert.equal(result.data.preparedBy, "");
  assert.equal(result.data.notes, "");
});

test("confirmInvoicePaymentSchema requires a method and a reference", () => {
  const ok = confirmInvoicePaymentSchema.safeParse({
    paymentMethod: "bank_transfer",
    paymentReference: "TXN-123",
  });
  assert.equal(ok.success, true);

  const noReference = confirmInvoicePaymentSchema.safeParse({
    paymentMethod: "bank_transfer",
    paymentReference: "   ",
  });
  assert.equal(noReference.success, false);

  const badMethod = confirmInvoicePaymentSchema.safeParse({
    paymentMethod: "crypto",
    paymentReference: "TXN-123",
  });
  assert.equal(badMethod.success, false);
});
