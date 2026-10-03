"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";
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

  detail: (areaId: string, id: string) =>
    [...attendanceKeys.all, "detail", areaId, id] as const,
};

// ======================================
// DAILY ATTENDANCE REPORT
// ======================================

export function useAttendanceReport(filters?: AttendanceFilters) {
  const { selectedAreaId } = useSelectedArea();
  const effectiveFilters = {
    ...filters,
    area: selectedAreaId ?? undefined,
  };

  return useQuery({
    queryKey: attendanceKeys.dailyReport(effectiveFilters),
    queryFn: () => getAttendanceReport(effectiveFilters, selectedAreaId!),
    enabled: Boolean(selectedAreaId),
  });
}

// ======================================
// SINGLE ATTENDANCE
// ======================================

export function useAttendanceById(id?: string) {
  const { selectedAreaId } = useSelectedArea();

  return useQuery({
    queryKey: attendanceKeys.detail(selectedAreaId ?? "", id ?? ""),
    queryFn: () => getAttendanceById(id!, selectedAreaId!),
    enabled: Boolean(id && selectedAreaId),
  });
}

// ======================================
// UPDATE ATTENDANCE
// ======================================

export function useUpdateAttendance() {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAttendancePayload;
    }) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return updateAttendance(id, payload, selectedAreaId);
    },

    onSuccess: (updatedAttendance, variables) => {
      // Update the individual attendance cache
      queryClient.setQueryData(
        attendanceKeys.detail(selectedAreaId!, variables.id),
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
  const { selectedAreaId } = useSelectedArea();
  const effectiveFilters = {
    ...filters,
    area: selectedAreaId ?? undefined,
  };

  return useQuery({
    queryKey: attendanceKeys.monthlyReport(effectiveFilters),
    queryFn: () => getMonthlyAttendanceReport(effectiveFilters, selectedAreaId!),
    enabled: Boolean(selectedAreaId),
  });
}
