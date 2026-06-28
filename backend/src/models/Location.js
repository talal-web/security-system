// models/location.model.js

import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Location name is required"],
      trim: true,
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    sector: {
      type: String,
      enum: ["zone_1_a", "zone_1_b", "zone_1_c", "zone_1_d", "rawalpindi"],
      required: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
      index: true,
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

locationSchema.index({ name: 1, sector: 1 }, { unique: true });

const Location =
  mongoose.models.Location || mongoose.model("Location", locationSchema);

export default Location;
