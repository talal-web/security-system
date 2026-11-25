// backend/src/models/BankAuditLog.js
//
// Append-only record of every change to bank entries and the bank account.
// Written in the same transaction as the change it describes, so a change
// can never happen without its audit row.

import mongoose from "mongoose";

const bankAuditLogSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: ["BankEntry", "BankAccount"],
      required: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    action: {
      type: String,
      enum: ["create", "update", "delete"],
      required: true,
    },

    // Snapshot before the change (null for create) and after it (null for delete).
    before: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    after: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "changedAt", updatedAt: false },
  },
);

bankAuditLogSchema.index({ entityId: 1, changedAt: -1 });
bankAuditLogSchema.index({ changedAt: -1 });

const BankAuditLog =
  mongoose.models.BankAuditLog ||
  mongoose.model("BankAuditLog", bankAuditLogSchema);

export default BankAuditLog;
