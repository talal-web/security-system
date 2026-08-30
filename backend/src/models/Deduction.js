import mongoose from "mongoose";

const deductionSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee is required"],
      index: true,
    },

    amount: {
      type: Number,
      required: [true, "Deduction amount is required"],
      min: [1, "Deduction amount must be greater than 0"],
      validate: {
        validator: (value) => Number.isFinite(value) && Number.isInteger(value),
        message: "Deduction amount must be a valid whole number",
      },
    },

    remainingAmount: {
      type: Number,
      required: true,
      min: [0, "Remaining amount cannot be negative"],
      validate: {
        validator: function (value) {
          return (
            Number.isFinite(value) &&
            Number.isInteger(value) &&
            value <= this.amount
          );
        },
        message:
          "Remaining amount must be a valid whole number and cannot exceed the deduction amount",
      },
    },

    deductionDate: {
      type: Date,
      required: [true, "Deduction date is required"],
      default: Date.now,
    },

    reason: {
      type: String,
      required: [true, "Deduction reason is required"],
      trim: true,
      maxlength: [500, "Deduction reason cannot exceed 500 characters"],
    },

    status: {
      type: String,
      enum: {
        values: [
          "pending",
          "partially_deducted",
          "fully_deducted",
          "cancelled",
        ],
        message: "Invalid deduction status",
      },
      default: "pending",
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

// Employee deduction history + FIFO ordering
deductionSchema.index({
  employee: 1,
  deductionDate: 1,
});

// Efficient lookup of outstanding deductions
deductionSchema.index({
  employee: 1,
  status: 1,
});

const Deduction =
  mongoose.models.Deduction || mongoose.model("Deduction", deductionSchema);

export default Deduction;
