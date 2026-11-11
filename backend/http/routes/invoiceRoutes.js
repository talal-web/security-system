// backend/http/routes/invoiceRoutes.js
//
// Invoices are not area-scoped (they are company-wide client bills).
// Developers create and confirm; admins can view for follow-up.

import express from "express";

import {
  getInvoices,
  getInvoice,
  createInvoiceHandler,
  confirmPayment,
} from "../controllers/invoiceController.js";

import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { validate } from "../validators/validate.js";
import {
  createInvoiceSchema,
  confirmInvoicePaymentSchema,
} from "../validators/invoiceSchemas.js";

const router = express.Router();

// View: developers and admins
router.get("/", authorizeRoles("developer", "admin"), getInvoices);
router.get("/:id", authorizeRoles("developer", "admin"), getInvoice);

// Create and confirm payment: developers only
router.post(
  "/",
  authorizeRoles("developer"),
  validate(createInvoiceSchema),
  createInvoiceHandler,
);

router.patch(
  "/:id/confirm-payment",
  authorizeRoles("developer"),
  validate(confirmInvoicePaymentSchema),
  confirmPayment,
);

export default router;
