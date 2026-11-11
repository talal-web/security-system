import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notification.service";

export const notificationKeys = {
  all: ["notifications"] as const,
};

/**
 * Notifications for the signed-in user's role. Polls so admins see new
 * invoice activity without reloading. Pass enabled=false for roles that
 * have no notifications endpoint access.
 */
export function useNotifications(enabled: boolean) {
  return useQuery({
    queryKey: notificationKeys.all,
    queryFn: getNotifications,
    enabled,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    retry: false,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
