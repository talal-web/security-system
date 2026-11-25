// backend/src/models/BankAccount.js
//
// The admin's bank account. Balances are never stored here: they are derived
// from BankEntry documents. This model only holds the starting point.

import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Account name is required"],
      trim: true,
      maxlength: [200, "Account name cannot exceed 200 characters"],
    },

    // Balance the account had on openingDate, before any BankEntry.
    openingBalance: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: (value) => Number.isFinite(value),
        message: "Opening balance must be a finite number",
      },
    },

    // Entries dated before this are not part of the account's history.
    openingDate: {
      type: Date,
      required: [true, "Opening date is required"],
      default: Date.now,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by is required"],
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const BankAccount =
  mongoose.models.BankAccount ||
  mongoose.model("BankAccount", bankAccountSchema);

export default BankAccount;
