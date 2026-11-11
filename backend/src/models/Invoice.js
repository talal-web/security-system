// backend/src/models/Invoice.js
//
// A client-facing invoice: money coming IN to the company.
// Created by a developer, confirmed as paid by a developer once the
// payment has been received in the company bank account.

import mongoose from "mongoose";

const { Schema } = mongoose;

const invoiceSchema = new Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      unique: true,
    },

    invoiceDate: { type: Date, required: true },
    serviceFrom: { type: Date, required: true },
    serviceTo: { type: Date, required: true },
    dueDate: { type: Date, required: true },

    clientName: { type: String, required: true, trim: true, maxlength: 200 },
    preparedBy: { type: String, trim: true, maxlength: 200, default: "" },

    description: { type: String, required: true, trim: true, maxlength: 1000 },

    amount: { type: Number, required: true, min: 0 },

    notes: { type: String, trim: true, maxlength: 2000, default: "" },

    // Company bank details the client pays into.
    bankName: { type: String, trim: true, maxlength: 200, default: "" },
    accountTitle: { type: String, trim: true, maxlength: 200, default: "" },
    accountNumber: { type: String, trim: true, maxlength: 100, default: "" },
    iban: { type: String, trim: true, maxlength: 100, default: "" },

    // Payment lifecycle: issued (pending) -> paid
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
      required: true,
      index: true,
    },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    paidAt: { type: Date, default: null },
    paidOn: { type: Date, default: null },
    paidBy: { type: Schema.Types.ObjectId, ref: "User", default: null },

    paymentMethod: {
      type: String,
      enum: ["cash", "bank_transfer", "other"],
      default: null,
    },

    paymentReference: { type: String, trim: true, maxlength: 200, default: "" },
  },
  { timestamps: true },
);

invoiceSchema.index({ status: 1, createdAt: -1 });

const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

export default Invoice;
