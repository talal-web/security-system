// backend/src/services/notification/NotificationService.js

import mongoose from "mongoose";

import Notification from "../../models/Notification.js";
import ApiError from "../../utils/ApiError.js";

const LIST_LIMIT = 50;

// Read state resets at local midnight. Asia/Karachi is UTC+5 with no DST.
const DAY_TIMEZONE = "Asia/Karachi";

function startOfToday(now = new Date()) {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: DAY_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now); // YYYY-MM-DD

  return new Date(`${ymd}T00:00:00+05:00`);
}

// Matches notifications the user has read today.
function readTodayFilter(userObjectId, since) {
  return {
    readBy: { $elemMatch: { user: userObjectId, readAt: { $gte: since } } },
  };
}

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
 * Delete notifications of one type attached to one record, e.g. the
 * "invoice issued" notice once that invoice has been paid.
 */
export async function removeNotificationsForRef({ refModel, refId, type }) {
  await Notification.deleteMany({ refModel, refId, type });
}

/**
 * Notifications for the caller's own role, newest first, with a per-user
 * `isRead` flag and the total unread count.
 */
export async function listNotificationsForUser({ role, userId }) {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const since = startOfToday();

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
    isRead: doc.readBy.some(
      (entry) =>
        String(entry.user) === String(userId) && entry.readAt >= since,
    ),
  }));

  const unreadCount = await Notification.countDocuments({
    recipientRole: role,
    $nor: [readTodayFilter(userObjectId, since)],
  });

  return { items, unreadCount };
}

export async function markNotificationRead({ id, role, userId }) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid notification ID");
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const result = await Notification.updateOne(
    { _id: id, recipientRole: role },
    { $pull: { readBy: { user: userObjectId } } },
  );

  if (result.matchedCount === 0) {
    throw new ApiError(404, "Notification not found");
  }

  await Notification.updateOne(
    { _id: id, recipientRole: role },
    { $push: { readBy: { user: userObjectId, readAt: new Date() } } },
  );
}

export async function markAllNotificationsRead({ role, userId }) {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const since = startOfToday();
  const unreadFilter = {
    recipientRole: role,
    $nor: [readTodayFilter(userObjectId, since)],
  };

  await Notification.updateMany(unreadFilter, {
    $pull: { readBy: { user: userObjectId } },
  });

  await Notification.updateMany(unreadFilter, {
    $push: { readBy: { user: userObjectId, readAt: new Date() } },
  });
}
