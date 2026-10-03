// backend/src/models/Payroll.js

import mongoose from "mongoose";

const { Schema } = mongoose;

const payrollItemSchema = new Schema(
  {
    source: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isFinite,
        message: "Amount must be a finite number",
      },
    },
  },
  { _id: false },
);

const payrollSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },

    year: {
      type: Number,
      required: true,
      min: 2000,
      max: 2100,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    periodStart: {
      type: Date,
      required: true,
    },

    periodEnd: {
      type: Date,
      required: true,
    },

    // Salary snapshot
    monthlySalary: {
      type: Number,
      required: true,
      min: 0,
    },

    salaryEffectiveFrom: {
      type: Date,
      required: true,
    },

    calendarDays: {
      type: Number,
      required: true,
      min: 28,
      max: 31,
    },

    payableDays: {
      type: Number,
      required: true,
      min: 0,
      max: 31,
    },

    salaryPerDay: {
      type: Number,
      required: true,
      min: 0,
    },

    // Attendance snapshot
    presentDays: {
      type: Number,
      required: true,
      min: 0,
      max: 31,
    },

    leaveDays: {
      type: Number,
      required: true,
      min: 0,
      max: 31,
    },
    absentDays: {
      type: Number,
      required: true,
      min: 0,
      max: 31,
    },

    missingDays: {
      type: Number,
      required: true,
      min: 0,
      max: 31,
    },

    // Earnings
    earnedSalary: {
      type: Number,
      required: true,
      min: 0,
    },

    bonuses: {
      type: [payrollItemSchema],
      default: [],
    },

    totalBonus: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    grossSalary: {
      type: Number,
      required: true,
      min: 0,
    },

    // Deductions
    advanceDeductions: {
      type: [payrollItemSchema],
      default: [],
    },

    fineDeductions: {
      type: [payrollItemSchema],
      default: [],
    },

    otherDeductions: {
      type: [payrollItemSchema],
      default: [],
    },

    totalAdvanceDeduction: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    totalFineDeduction: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    totalOtherDeduction: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    totalDeductions: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    netSalary: {
      type: Number,
      required: true,
      min: 0,
    },

    // Payroll lifecycle
    status: {
      type: String,
      enum: ["draft", "finalized", "paid"],
      default: "draft",
      required: true,
      index: true,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },

    finalizedAt: {
      type: Date,
      default: null,
    },

    finalizedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    paidBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "bank_transfer", "other"],
      default: null,
    },

    paymentReference: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", index: true },

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// One payroll per employee per month
payrollSchema.index({ employee: 1, year: 1, month: 1 }, { unique: true });

// Useful for monthly payroll listing
payrollSchema.index({ year: 1, month: 1, status: 1 });

// Useful for employee payroll history
payrollSchema.index({ employee: 1, year: -1, month: -1 });

const Payroll = mongoose.model("Payroll", payrollSchema);

export default Payroll;
