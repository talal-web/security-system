import mongoose from "mongoose";

const employeeSalarySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee is required"],
      index: true,
    },

    monthlySalary: {
      type: Number,
      required: [true, "Monthly salary is required"],
      min: [0, "Monthly salary cannot be negative"],
      validate: {
        validator: Number.isFinite,
        message: "Monthly salary must be a valid number",
      },
    },

    effectiveFrom: {
      type: Date,
      required: [true, "Salary effective date is required"],
      validate: {
        validator: function (value) {
          return (
            value instanceof Date &&
            !Number.isNaN(value.getTime()) &&
            value.getUTCDate() === 1
          );
        },
        message: "Salary effective date must be the first day of a month",
      },
    },

    reason: {
      type: String,
      enum: {
        values: [
          "initial_salary",
          "salary_increase",
          "salary_decrease",
          "promotion",
          "designation_change",
          "other",
        ],
        message: "Invalid salary change reason",
      },
      default: "initial_salary",
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by is required"],
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

/*
 * One salary record per employee per effective month.
 *
 * Example:
 * Employee A + 2026-06-01 → unique
 * Employee A + 2026-09-01 → unique
 */
employeeSalarySchema.index({ employee: 1, effectiveFrom: 1 }, { unique: true });

/*
 * Useful when finding the latest salary effective
 * on or before a payroll month.
 */
employeeSalarySchema.index({
  employee: 1,
  effectiveFrom: -1,
});

const EmployeeSalary = mongoose.model("EmployeeSalary", employeeSalarySchema);

export default EmployeeSalary;
