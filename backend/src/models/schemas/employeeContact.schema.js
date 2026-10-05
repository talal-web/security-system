import mongoose from "mongoose";

// ======================================
// Contact Validation
// ======================================

export const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

export const validatePhone = {
  validator(value) {
    if (!value) return true;

    return phoneRegex.test(value.trim());
  },

  message: (props) =>
    `${props.path} must be a valid phone number`,
};

// ======================================
// Shared Contact Fields
// ======================================

const contactFields = {
  name: {
    type: String,
    trim: true,
    default: "",
    maxlength: 100,
  },

  relation: {
    type: String,
    trim: true,
    default: "",
    maxlength: 50,
  },

  contact: {
    type: String,
    trim: true,
    default: "",
    validate: validatePhone,
  },

  address: {
    type: String,
    trim: true,
    default: "",
    maxlength: 300,
  },
};

// ======================================
// Emergency Contact Schema
// ======================================

export const emergencyContactSchema =
  new mongoose.Schema(
    {
      ...contactFields,

      isPrimary: {
        type: Boolean,
        default: false,
      },
    },
    {
      _id: false,
    },
  );

// ======================================
// Reference Schema
// ======================================

export const referenceSchema =
  new mongoose.Schema(
    {
      ...contactFields,
    },
    {
      _id: false,
    },
  );