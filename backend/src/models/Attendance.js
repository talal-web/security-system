import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    // EMPLOYEE
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    // LOCATION
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },

    // DATE (NOW STRING)
    date: {
      type: String, // YYYY-MM-DD (timezone safe)
      required: true,
    },

    // SHIFT
    shift: {
      type: String,
      enum: ["nil", "day", "night"],
      default: "nil",
    },

    status: {
      type: String,
      enum: ["present", "absent", "leave"],
      required: true,
    },

    remarks: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// INDEXES (UPDATED for string date)
attendanceSchema.index(
  {
    employee: 1,
    date: 1,
  },
  { unique: true },
);

attendanceSchema.index({ employee: 1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ location: 1 });

const Attendance =
  mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);

export default Attendance;
