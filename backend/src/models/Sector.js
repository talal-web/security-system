import mongoose from "mongoose";

const sectorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sector name is required"],
      trim: true,
    },

    code: {
      type: String,
      required: [true, "Sector code is required"],
      trim: true,
      uppercase: true,
      unique: true,
    },

    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: [true, "Area is required"],
      index: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

sectorSchema.index({ sortOrder: 1, name: 1 });
sectorSchema.index({ area: 1, sortOrder: 1, name: 1 });

const Sector = mongoose.models.Sector || mongoose.model("Sector", sectorSchema);

export default Sector;
