import mongoose from "mongoose";

const advanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee is required"],
      index: true,
    },

    amount: {
      type: Number,
      required: [true, "Advance amount is required"],
      min: [0.01, "Advance amount must be greater than 0"],
      validate: {
        validator: Number.isFinite,
        message: "Advance amount must be a valid number",
      },
    },

    remainingAmount: {
      type: Number,
      required: true,
      min: [0, "Remaining amount cannot be negative"],
      validate: {
        validator: function (value) {
          return Number.isFinite(value) && value <= this.amount;
        },
        message: "Remaining amount cannot exceed the original advance amount",
      },
    },

    advanceDate: {
      type: Date,
      required: [true, "Advance date is required"],
      default: Date.now,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    status: {
      type: String,
      enum: {
        values: ["active", "partially_deducted", "fully_deducted", "cancelled"],
        message: "Invalid advance status",
      },
      default: "active",
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

// Useful for FIFO deduction and employee advance history
advanceSchema.index({
  employee: 1,
  advanceDate: 1,
});

// Useful for finding outstanding advances
advanceSchema.index({
  employee: 1,
  status: 1,
});

const Advance =
  mongoose.models.Advance || mongoose.model("Advance", advanceSchema);

export default Advance;
