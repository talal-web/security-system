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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sector",
      required: [true, "Sector is required"],
      index: true,
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
