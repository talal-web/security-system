import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAttendanceSession,
  markAttendanceSession,
} from "@/services/attendance-session.service";

import type {
  AttendanceSessionResponse,
  MarkAttendanceSessionPayload,
  MarkAttendanceSessionResponse,
  MarkAttendanceSessionValidationResponse,
} from "@/types/attendance-session";

import { ApiError } from "@/lib/api-error";

// ======================================
// QUERY KEYS
// ======================================

export const attendanceSessionKeys = {
  all: ["attendance-session"] as const,
};

// ======================================
// GET ATTENDANCE SESSION
// ======================================

export function useAttendanceSession() {
  return useQuery<AttendanceSessionResponse>({
    queryKey: attendanceSessionKeys.all,
    queryFn: getAttendanceSession,
  });
}

// ======================================
// MARK ATTENDANCE SESSION
// ======================================

export function useMarkAttendanceSession() {
  const queryClient = useQueryClient();

  return useMutation<
    MarkAttendanceSessionResponse,
    ApiError<MarkAttendanceSessionValidationResponse>,
    MarkAttendanceSessionPayload
  >({
    mutationFn: markAttendanceSession,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: attendanceSessionKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: ["attendance"],
      });
    },
  });
}
