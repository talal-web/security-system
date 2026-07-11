"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getAttendanceReport,
  getMonthlyAttendanceReport,
} from "@/services/attendance.service";

import type {
  AttendanceFilters,
  AttendanceResponse,
  MonthlyAttendanceFilters,
  MonthlyAttendanceResponse,
} from "@/types/attendance";

// ============================
// QUERY KEYS
// ============================

export const attendanceKeys = {
  all: ["attendance"] as const,

  // ==========================
  // DAILY
  // ==========================

  lists: () => [...attendanceKeys.all, "list"] as const,

  list: (filters?: AttendanceFilters) =>
    [...attendanceKeys.lists(), filters] as const,

  // ==========================
  // MONTHLY
  // ==========================

  monthlyLists: () => [...attendanceKeys.all, "monthly"] as const,

  monthlyList: (filters: MonthlyAttendanceFilters) =>
    [...attendanceKeys.monthlyLists(), filters] as const,

  // ==========================
  // OTHER
  // ==========================

  details: () => [...attendanceKeys.all, "detail"] as const,

  detail: (id: string) => [...attendanceKeys.details(), id] as const,

  stats: () => [...attendanceKeys.all, "stats"] as const,
};

// ============================
// DAILY REPORT
// ============================

export function useAttendanceReport(filters?: AttendanceFilters) {
  return useQuery<AttendanceResponse, Error>({
    queryKey: attendanceKeys.list(filters),
    queryFn: () => getAttendanceReport(filters),
    staleTime: 1000 * 60,
  });
}

// ============================
// MONTHLY REPORT
// ============================

export function useMonthlyAttendanceReport(filters: MonthlyAttendanceFilters) {
  return useQuery<MonthlyAttendanceResponse, Error>({
    queryKey: attendanceKeys.monthlyList(filters),
    queryFn: () => getMonthlyAttendanceReport(filters),
    enabled: Boolean(filters.month),
    staleTime: 1000 * 60 * 5,
  });
}
