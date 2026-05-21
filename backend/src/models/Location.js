// models/location.model.js

import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Location name is required"],
      trim: true,
      unique: true,
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    sector: {
      type: String,
      trim: true,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Location =
  mongoose.models.Location || mongoose.model("Location", locationSchema);

export default Location;
