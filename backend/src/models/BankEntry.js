// backend/src/models/BankEntry.js
//
// One money movement in or out of a BankAccount.
// Balances and monthly totals are computed from these entries.

import mongoose from "mongoose";

// Each kind has a fixed direction. The direction is derived from the kind,
// so a caller cannot record, for example, an "income" that goes out.
export const BANK_ENTRY_KINDS = {
  income: "in",
  rent: "out",
  expense: "out",
  advance: "out",
  salary: "out",
  savings_deposit: "out", // leaves the bank, goes into savings
  savings_withdrawal: "in", // comes back from savings into the bank
};

export const BANK_ENTRY_KIND_VALUES = Object.keys(BANK_ENTRY_KINDS);

// Kinds that must be tied to an employee.
const EMPLOYEE_KINDS = ["advance", "salary"];

const bankEntrySchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
      required: [true, "Bank account is required"],
      index: true,
    },

    kind: {
      type: String,
      enum: {
        values: BANK_ENTRY_KIND_VALUES,
        message: "Invalid bank entry kind",
      },
      required: [true, "Entry kind is required"],
    },

    // Derived from kind in the pre-validate hook. Not supplied by callers.
    direction: {
      type: String,
      enum: ["in", "out"],
      required: true,
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
      validate: {
        validator: (value) => Number.isFinite(value),
        message: "Amount must be a valid number",
      },
    },

    // The date the money actually moved (cash basis).
    entryDate: {
      type: Date,
      required: [true, "Entry date is required"],
      default: Date.now,
    },

    // "YYYY-MM" from entryDate (UTC). Derived in the pre-validate hook.
    // Lets monthly reports use a simple indexed equality match.
    month: {
      type: String,
      match: [/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be in YYYY-MM format"],
      index: true,
    },

    category: {
      type: String,
      trim: true,
      maxlength: [100, "Category cannot exceed 100 characters"],
      default: "",
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
      index: true,
    },

    // Optional link to the record that caused this entry, e.g. a paid
    // Invoice (income) or a paid Payroll run (salary).
    source: {
      kind: {
        type: String,
        enum: ["Invoice", "Payroll", "Bonus", "Advance", null],
        default: null,
      },
      refId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
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

    // Soft delete keeps the audit trail. Queries must filter deletedAt: null.
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

bankEntrySchema.pre("validate", function () {
  // Direction always follows the kind.
  if (this.kind) {
    this.direction = BANK_ENTRY_KINDS[this.kind];
  }

  // Month is always derived from the entry date, in UTC.
  if (this.entryDate) {
    const date = new Date(this.entryDate);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    this.month = `${year}-${month}`;
  }

  // Employee is required for advances and salaries, and not allowed otherwise.
  if (EMPLOYEE_KINDS.includes(this.kind)) {
    if (!this.employee) {
      this.invalidate("employee", "Employee is required for this entry kind");
    }
  } else {
    this.employee = null;
  }
});

// Monthly report: all live entries of one account in one month.
bankEntrySchema.index({
  account: 1,
  month: 1,
  deletedAt: 1,
});

// Opening balance: all live entries of one account before a date.
bankEntrySchema.index({
  account: 1,
  entryDate: 1,
  deletedAt: 1,
});

// Employee history (advances and salaries).
bankEntrySchema.index({
  employee: 1,
  entryDate: -1,
});

const BankEntry =
  mongoose.models.BankEntry || mongoose.model("BankEntry", bankEntrySchema);

export default BankEntry;
