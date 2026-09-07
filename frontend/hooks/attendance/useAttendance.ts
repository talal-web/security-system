"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAttendanceById,
  getAttendanceReport,
  getMonthlyAttendanceReport,
  updateAttendance,
} from "@/services/attendance.service";

import type {
  AttendanceFilters,
  MonthlyAttendanceFilters,
  UpdateAttendancePayload,
} from "@/types/attendance";

// ======================================
// QUERY KEYS
// ======================================

export const attendanceKeys = {
  all: ["attendance"] as const,

  reports: () => [...attendanceKeys.all, "reports"] as const,

  lists: () => [...attendanceKeys.reports(), "daily"] as const,

  dailyReport: (filters?: AttendanceFilters) =>
    [...attendanceKeys.lists(), filters] as const,

  list: (filters?: AttendanceFilters) => attendanceKeys.dailyReport(filters),

  monthlyLists: () => [...attendanceKeys.reports(), "monthly"] as const,

  monthlyReport: (filters: MonthlyAttendanceFilters) =>
    [...attendanceKeys.monthlyLists(), filters] as const,

  monthlyList: (filters: MonthlyAttendanceFilters) =>
    attendanceKeys.monthlyReport(filters),

  detail: (id: string) => [...attendanceKeys.all, "detail", id] as const,
};

// ======================================
// DAILY ATTENDANCE REPORT
// ======================================

export function useAttendanceReport(filters?: AttendanceFilters) {
  return useQuery({
    queryKey: attendanceKeys.dailyReport(filters),
    queryFn: () => getAttendanceReport(filters),
  });
}

// ======================================
// SINGLE ATTENDANCE
// ======================================

export function useAttendanceById(id?: string) {
  return useQuery({
    queryKey: attendanceKeys.detail(id ?? ""),
    queryFn: () => getAttendanceById(id!),
    enabled: Boolean(id),
  });
}

// ======================================
// UPDATE ATTENDANCE
// ======================================

export function useUpdateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAttendancePayload;
    }) => updateAttendance(id, payload),

    onSuccess: (updatedAttendance, variables) => {
      // Update the individual attendance cache
      queryClient.setQueryData(
        attendanceKeys.detail(variables.id),
        updatedAttendance,
      );

      // Refresh attendance reports
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.reports(),
      });
    },
  });
}

// ======================================
// MONTHLY ATTENDANCE REPORT
// ======================================

export function useMonthlyAttendanceReport(filters: MonthlyAttendanceFilters) {
  return useQuery({
    queryKey: attendanceKeys.monthlyReport(filters),
    queryFn: () => getMonthlyAttendanceReport(filters),
  });
}
