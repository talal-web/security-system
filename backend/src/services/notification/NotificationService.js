// backend/src/services/notification/NotificationService.js

import mongoose from "mongoose";

import Notification from "../../models/Notification.js";
import ApiError from "../../utils/ApiError.js";

const LIST_LIMIT = 50;

/**
 * Create one notification addressed to every user of a role.
 * Read state is per user (readBy), so one document serves all of them.
 */
export async function notifyRole({
  recipientRole,
  type,
  title,
  message,
  href = "",
  refModel,
  refId,
  createdBy = null,
}) {
  return Notification.create({
    recipientRole,
    type,
    title,
    message,
    href,
    refModel,
    refId,
    createdBy,
  });
}

/**
 * Notifications for the caller's own role, newest first, with a per-user
 * `isRead` flag and the total unread count.
 */
export async function listNotificationsForUser({ role, userId }) {
  const docs = await Notification.find({ recipientRole: role })
    .sort({ createdAt: -1 })
    .limit(LIST_LIMIT)
    .lean();

  const items = docs.map((doc) => ({
    _id: doc._id,
    type: doc.type,
    title: doc.title,
    message: doc.message,
    href: doc.href,
    refModel: doc.refModel,
    refId: doc.refId,
    createdAt: doc.createdAt,
    isRead: doc.readBy.some((id) => String(id) === String(userId)),
  }));

  const unreadCount = await Notification.countDocuments({
    recipientRole: role,
    readBy: { $ne: new mongoose.Types.ObjectId(userId) },
  });

  return { items, unreadCount };
}

export async function markNotificationRead({ id, role, userId }) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid notification ID");
  }

  const result = await Notification.updateOne(
    { _id: id, recipientRole: role },
    { $addToSet: { readBy: userId } },
  );

  if (result.matchedCount === 0) {
    throw new ApiError(404, "Notification not found");
  }
}

export async function markAllNotificationsRead({ role, userId }) {
  await Notification.updateMany(
    { recipientRole: role, readBy: { $ne: userId } },
    { $addToSet: { readBy: userId } },
  );
}
