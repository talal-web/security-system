import mongoose from "mongoose";

import {
  emergencyContactSchema,
  referenceSchema,
  validatePhone,
} from "./schemas/employeeContact.schema.js";

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
      validate: validatePhone,
    },

    emergencyContacts: {
      type: [emergencyContactSchema],
      default: [],
    },

    references: {
      type: [referenceSchema],
      default: [],
    },

    // =========================
    // Education
    // =========================

    education: {
      type: String,
      enum: [
        "none",
        "middle",
        "matric",
        "fsc",
        "bs",
        "master",
      ],
      default: null,
    },

    designation: {
      type: String,
      enum: [
        "guard",
        "army_guard",
        "asst_supervisor",
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

    // =========================
    // Area / Location
    // =========================

    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      default: null,
    },

    sector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sector",
    },

    currentLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      default: null,
    },

    defaultShift: {
      type: String,
      enum: ["day", "night"],
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

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  },
);

// ======================================
// Virtual: Age
// ======================================

employeeSchema.virtual("age").get(function () {
  if (!this.birthDate) return null;

  const today = new Date();
  const birth = new Date(this.birthDate);

  let age =
    today.getFullYear() -
    birth.getFullYear();

  const monthDifference =
    today.getMonth() -
    birth.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < birth.getDate()
    )
  ) {
    age--;
  }

  return age;
});

// ======================================
// Employee Validation
// ======================================

employeeSchema.pre("validate", function () {
  const primaryContacts =
    this.emergencyContacts?.filter(
      (contact) => contact.isPrimary === true,
    ) ?? [];

  if (primaryContacts.length > 1) {
    this.invalidate(
      "emergencyContacts",
      "Employee can have at most one primary emergency contact.",
    );
  }
});

// ======================================
// Model
// ======================================

const Employee =
  mongoose.models.Employee ||
  mongoose.model(
    "Employee",
    employeeSchema,
  );

export default Employee;