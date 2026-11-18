// backend/src/services/invoice/InvoiceService.js
//
// Client invoices (money in). Developers create invoices and confirm payment.
// Admins are notified when an invoice is issued and when it is paid.

import mongoose from "mongoose";

import Invoice from "../../models/Invoice.js";
import ApiError from "../../utils/ApiError.js";
import {
  notifyRole,
  removeNotificationsForRef,
} from "../notification/NotificationService.js";

const INVOICE_FIELDS = [
  "invoiceNumber",
  "invoiceDate",
  "serviceFrom",
  "serviceTo",
  "dueDate",
  "clientName",
  "preparedBy",
  "description",
  "amount",
  "notes",
  "bankName",
  "accountTitle",
  "accountNumber",
  "iban",
];

/**
 * Save a new invoice in the pending state and notify admins.
 * Field shapes are validated by createInvoiceSchema.
 */
export async function createInvoice({ data, userId }) {
  const payload = {};
  for (const field of INVOICE_FIELDS) {
    payload[field] = data[field];
  }

  const invoice = await Invoice.create({
    ...payload,
    status: "pending",
    createdBy: userId,
  });

  await notifyRole({
    recipientRole: "admin",
    type: "invoice.issued",
    title: "Service fee pending",
    message: `${invoice.clientName} owes ${formatAmount(invoice.amount)} for invoice ${invoice.invoiceNumber}. Payment is pending.`,
    href: invoiceHref(invoice._id),
    refModel: "Invoice",
    refId: invoice._id,
    createdBy: userId,
  });

  return invoice;
}

export async function listInvoices({ status } = {}) {
  const filter = {};
  if (status) filter.status = status;

  return Invoice.find(filter)
    .sort({ createdAt: -1 })
    .select("-__v")
    .lean();
}

export async function getInvoiceById(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid invoice ID");
  }

  const invoice = await Invoice.findById(id).select("-__v").lean();

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  return invoice;
}

/**
 * Confirm that the client's payment has been received.
 * Only a pending invoice can be confirmed. The status check is part of the
 * update filter, so two developers confirming at the same moment cannot
 * both succeed.
 */
export async function confirmInvoicePayment({
  id,
  userId,
  paymentMethod,
  paymentReference,
  paidOn,
}) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid invoice ID");
  }

  const invoice = await Invoice.findOneAndUpdate(
    { _id: id, status: "pending" },
    {
      $set: {
        status: "paid",
        paymentMethod,
        paymentReference: paymentReference.trim(),
        paidOn: paidOn ?? new Date(),
        paidAt: new Date(),
        paidBy: userId,
      },
    },
    { new: true },
  ).lean();

  if (!invoice) {
    const exists = await Invoice.exists({ _id: id });
    if (!exists) throw new ApiError(404, "Invoice not found");
    throw new ApiError(400, "Only pending invoices can be marked as paid");
  }

  // The "awaiting payment" notice is stale now, so it is removed for every admin.
  await removeNotificationsForRef({
    refModel: "Invoice",
    refId: invoice._id,
    type: "invoice.issued",
  });

  await notifyRole({
    recipientRole: "admin",
    type: "invoice.paid",
    title: "Service fee received",
    message: `${invoice.clientName} paid ${formatAmount(invoice.amount)} for invoice ${invoice.invoiceNumber}.`,
    href: invoiceHref(invoice._id),
    refModel: "Invoice",
    refId: invoice._id,
    createdBy: userId,
  });

  return invoice;
}

// Currency is not stored on invoices, so messages show the bare amount.
function formatAmount(amount) {
  return Number(amount).toLocaleString("en-US");
}

// Admins open invoices on the read-only page /invoice/:id.
function invoiceHref(id) {
  return `/invoice/${id}`;
}
