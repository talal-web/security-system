import mongoose from "mongoose";

const bonusSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee is required"],
      index: true,
    },

    amount: {
      type: Number,
      required: [true, "Bonus amount is required"],
      min: [1, "Bonus amount must be greater than 0"],
      validate: {
        validator: (value) => Number.isFinite(value) && Number.isInteger(value),
        message: "Bonus amount must be a valid whole number",
      },
    },

    bonusDate: {
      type: Date,
      required: [true, "Bonus date is required"],
      default: Date.now,
    },

    reason: {
      type: String,
      required: [true, "Bonus reason is required"],
      trim: true,
      maxlength: [500, "Bonus reason cannot exceed 500 characters"],
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "paid", "cancelled"],
        message: "Invalid bonus status",
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

// Employee bonus history
bonusSchema.index({
  employee: 1,
  bonusDate: -1,
});

// Useful for payroll/reporting
bonusSchema.index({
  employee: 1,
  status: 1,
});

const Bonus = mongoose.models.Bonus || mongoose.model("Bonus", bonusSchema);

export default Bonus;
