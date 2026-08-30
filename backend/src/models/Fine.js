import mongoose from "mongoose";

const fineSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee is required"],
      index: true,
    },

    amount: {
      type: Number,
      required: [true, "Fine amount is required"],
      min: [1, "Fine amount must be greater than 0"],
      validate: {
        validator: (value) => Number.isFinite(value) && Number.isInteger(value),
        message: "Fine amount must be a valid whole number",
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
          "Remaining amount must be a valid whole number and cannot exceed the fine amount",
      },
    },

    fineDate: {
      type: Date,
      required: [true, "Fine date is required"],
      default: Date.now,
    },

    reason: {
      type: String,
      required: [true, "Fine reason is required"],
      trim: true,
      maxlength: [500, "Fine reason cannot exceed 500 characters"],
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
        message: "Invalid fine status",
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

// Useful for employee fine history and FIFO deduction
fineSchema.index({
  employee: 1,
  fineDate: 1,
});

// Useful for finding pending/outstanding fines
fineSchema.index({
  employee: 1,
  status: 1,
});

const Fine = mongoose.models.Fine || mongoose.model("Fine", fineSchema);

export default Fine;
