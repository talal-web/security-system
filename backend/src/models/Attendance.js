import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    // ================= EMPLOYEE =================
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    employeeSnapshot: {
      empId: {
        type: String,
        required: true,
        trim: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      fatherName: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // ================= ATTENDANCE =================
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    status: {
      type: String,
      enum: ["present", "absent", "leave"],
      required: true,
    },

    // Only for Present
    shift: {
      type: String,
      enum: ["day", "night"],
      default: null,
    },

    // ================= LOCATION =================
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      default: null,
    },

    locationSnapshot: {
      locationId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },

      name: {
        type: String,
        default: "",
        trim: true,
      },

      sector: {
        type: String,
        default: "",
      },
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

attendanceSchema.index(
  {
    employee: 1,
    date: 1,
  },
  {
    unique: true,
  },
);

attendanceSchema.index({ date: 1 });
attendanceSchema.index({ employee: 1 });
attendanceSchema.index({ location: 1 });

const Attendance =
  mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);

export default Attendance;
