import api from "@/lib/axios";
import {
  ApiError,
  getApiErrorMessage,
  getApiErrorStatus,
} from "@/lib/apiError";
import type { NotificationsResponse } from "@/types/notification";

function toNotificationApiError(error: unknown): ApiError {
  return new ApiError(getApiErrorMessage(error), getApiErrorStatus(error));
}

export async function getNotifications(): Promise<NotificationsResponse> {
  try {
    const res = await api.get("/notifications");

    return res.data;
  } catch (error) {
    throw toNotificationApiError(error);
  }
}

export async function markNotificationRead(notificationId: string) {
  try {
    await api.patch(`/notifications/${notificationId}/read`);
  } catch (error) {
    throw toNotificationApiError(error);
  }
}

export async function markAllNotificationsRead() {
  try {
    await api.patch("/notifications/read-all");
  } catch (error) {
    throw toNotificationApiError(error);
  }
}
