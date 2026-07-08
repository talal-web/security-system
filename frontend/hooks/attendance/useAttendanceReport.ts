"use client";

import { useQuery } from "@tanstack/react-query";

import { getAttendanceReport } from "@/services/attendance.service";

import type { AttendanceFilters, AttendanceResponse } from "@/types/attendance";

// ============================
// QUERY KEYS
// ============================
export const attendanceKeys = {
  all: ["attendance"] as const,

  lists: () => [...attendanceKeys.all, "list"] as const,

  list: (filters?: AttendanceFilters) =>
    [...attendanceKeys.lists(), filters] as const,

  details: () => [...attendanceKeys.all, "detail"] as const,

  detail: (id: string) => [...attendanceKeys.details(), id] as const,

  stats: () => [...attendanceKeys.all, "stats"] as const,
};

// ============================
// QUERY
// ============================

export function useAttendanceReport(filters?: AttendanceFilters) {
  return useQuery<AttendanceResponse, Error>({
    queryKey: attendanceKeys.list(filters),
    queryFn: () => getAttendanceReport(filters),
    staleTime: 1000 * 60,
  });
}
