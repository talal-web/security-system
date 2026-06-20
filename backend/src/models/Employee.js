// models/Employee.js

import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    // =========================
    // Personal Information
    // =========================

    empId: {
      type: String,
      unique: true,
      required: true,
      index: true,
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

    birthDate: {
      type: Date,
      required: true,
    },

    cnic: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================
    // CNIC Images
    // =========================

    cnicFrontImage: {
      type: String,
      default: "",
    },

    cnicBackImage: {
      type: String,
      default: "",
    },

    // =========================
    // Contact Information
    // =========================

    phone1: {
      type: String,
      required: true,
      trim: true,
    },

    phone2: {
      type: String,
      trim: true,
      default: "",
    },

    // =========================
    // Education
    // =========================

    education: {
      type: String,
      enum: ["nil", "middle", "matric", "fsc", "intermediate", "bs", "master"],
      default: "nil",
    },

    designation: {
      type: String,
      enum: [
        "guard",
        "army guard",
        "asst supervisor",
        "supervisor",
        "mcr",
        "driver",
        "clerk",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    basicSalary: {
      type: Number,
      default: 0,
    },

    // =========================
    // Reference
    // =========================

    reference: {
      type: String,
      trim: true,
      default: "",
    },
    sector: {
      type: String,
      enum: ["zone_1_a", "zone_1_b", "zone_1_c", "zone_1_d"],
      default: "nil",
    },

    currentLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      default: null,
    },

    // =========================
    // Dates
    // =========================

    entryDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    exitDate: {
      type: Date,
      default: null,
    },

    // =========================
    // Optional Fields
    // =========================

    profileImage: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ======================================
// Virtual Field: Age (calculated)
// ======================================

employeeSchema.virtual("age").get(function () {
  if (!this.birthDate) return null;

  const today = new Date();
  const birth = new Date(this.birthDate);

  let age = today.getFullYear() - birth.getFullYear();

  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
});
employeeSchema.set("toJSON", {
  virtuals: false,
});

const Employee =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default Employee;
