// backend/http/controllers/notificationController.js

import {
  listNotificationsForUser,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../src/services/notification/NotificationService.js";

/**
 * GET /api/notifications
 * Returns notifications addressed to the caller's role.
 */
export const getNotifications = async (req, res) => {
  const result = await listNotificationsForUser({
    role: req.user.role,
    userId: req.user.id,
  });

  res.status(200).json({
    success: true,
    ...result,
  });
};

/**
 * PATCH /api/notifications/:id/read
 */
export const readNotification = async (req, res) => {
  await markNotificationRead({
    id: req.params.id,
    role: req.user.role,
    userId: req.user.id,
  });

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
  });
};

/**
 * PATCH /api/notifications/read-all
 */
export const readAllNotifications = async (req, res) => {
  await markAllNotificationsRead({
    role: req.user.role,
    userId: req.user.id,
  });

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
};
