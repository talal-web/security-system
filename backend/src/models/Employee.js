// models/Employee.js

import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    // =========================
    // Personal Information
    // =========================

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

    age: {
      type: Number,
      required: true,
      min: 16,
      max: 60,
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

    // Education
    education: {
      type: String,
      enum: ["nil", "middle", "matric", "fsc", "intermediate", "bs", "master"],
      default: "nil",
    },

    // Designation
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

    // Status
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // =========================
    // Reference
    // =========================

    reference: {
      type: String,
      trim: true,
      default: "",
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
  },
);

const Employee =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default Employee;
