// backend/src/models/Notification.js
//
// In-app notification addressed to a role. Each user tracks their own read
// state through readBy, so one notification can be read by several admins
// independently.

import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    recipientRole: {
      type: String,
      enum: ["developer", "admin", "clerk", "supervisor"],
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["invoice.issued", "invoice.paid"],
      required: true,
    },

    title: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 500 },

    // Optional in-app link. Empty when the recipient role has no page for it
    // (invoices are developer-only, so admin notices are informational).
    href: { type: String, trim: true, maxlength: 300, default: "" },

    refModel: { type: String, enum: ["Invoice"], required: true },
    refId: { type: Schema.Types.ObjectId, required: true, index: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },

    // One entry per user who read it. A read only counts for the day it
    // happened, so notifications become unread again when a new day starts.
    readBy: {
      type: [
        new Schema(
          {
            user: { type: Schema.Types.ObjectId, ref: "User", required: true },
            readAt: { type: Date, required: true },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
  },
  { timestamps: true },
);

notificationSchema.index({ recipientRole: 1, createdAt: -1 });

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
