// backend/http/controllers/invoiceController.js

import {
  createInvoice,
  listInvoices,
  getInvoiceById,
  confirmInvoicePayment,
} from "../../src/services/invoice/InvoiceService.js";

/**
 * GET /api/invoices?status=pending|paid
 */
export const getInvoices = async (req, res) => {
  const invoices = await listInvoices({ status: req.query.status });

  res.status(200).json({
    success: true,
    count: invoices.length,
    data: invoices,
  });
};

/**
 * GET /api/invoices/:id
 */
export const getInvoice = async (req, res) => {
  const invoice = await getInvoiceById(req.params.id);

  res.status(200).json({
    success: true,
    data: invoice,
  });
};

/**
 * POST /api/invoices
 */
export const createInvoiceHandler = async (req, res) => {
  // Body is validated and normalized by createInvoiceSchema.
  const invoice = await createInvoice({
    data: req.body,
    userId: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Invoice saved and admins notified",
    data: invoice,
  });
};

/**
 * PATCH /api/invoices/:id/confirm-payment
 */
export const confirmPayment = async (req, res) => {
  const { paymentMethod, paymentReference, paidOn } = req.body;

  const invoice = await confirmInvoicePayment({
    id: req.params.id,
    userId: req.user.id,
    paymentMethod,
    paymentReference,
    paidOn: paidOn ? new Date(paidOn) : undefined,
  });

  res.status(200).json({
    success: true,
    message: "Payment confirmed and admins notified",
    data: invoice,
  });
};
