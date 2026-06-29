"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAttendanceBySector } from "@/services/attendance.service";

import type {
  AttendanceFilters,
  AttendanceRecord,
  AttendanceResponse,
} from "@/types/attendance";

// ============================
// QUERY KEYS (SCALABLE)
// ============================
export const attendanceKeys = {
  all: ["attendance"] as const,

  lists: () => [...attendanceKeys.all, "list"] as const,

  list: (filters?: AttendanceFilters) =>
    [...attendanceKeys.lists(), filters] as const,

  details: () => [...attendanceKeys.all, "detail"] as const,

  detail: (id: string) => [...attendanceKeys.details(), id] as const,

  // FUTURE READY (analytics/stats)
  stats: () => [...attendanceKeys.all, "stats"] as const,
};

// ============================
// QUERIES
// ============================

export function useAttendances(filters?: AttendanceFilters) {
  return useQuery<AttendanceResponse, Error>({
    queryKey: attendanceKeys.list(filters),
    queryFn: () => getAttendanceBySector(filters),
    staleTime: 1000 * 60, // 1 min cache (better UX)
  });
}
