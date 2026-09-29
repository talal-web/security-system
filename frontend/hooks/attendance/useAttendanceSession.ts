import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";
import {
  getAttendanceSession,
  markAttendanceSession,
  updateEmployeeLocations,
  updateEmployeeShifts,
} from "@/services/attendance-session.service";

import type {
  MarkAttendanceSessionPayload,
  MarkAttendanceSessionResponse,
  UpdateEmployeeLocationsPayload,
  UpdateEmployeeLocationsResponse,
  UpdateEmployeeShiftsPayload,
  UpdateEmployeeShiftsResponse,
} from "@/types/attendance-session";

// ======================================
// QUERY KEYS
// ======================================

export const attendanceSessionKeys = {
  all: ["attendance-session"] as const,
  list: (areaId?: string | null) =>
    [...attendanceSessionKeys.all, areaId ?? "all"] as const,
};

// ======================================
// GET ATTENDANCE SESSION
// ======================================

export function useAttendanceSession() {
  const { selectedAreaId } = useSelectedArea();

  return useQuery({
    queryKey: attendanceSessionKeys.list(selectedAreaId),
    queryFn: () => getAttendanceSession(selectedAreaId ?? undefined),
  });
}

// ======================================
// UPDATE EMPLOYEE LOCATIONS
// ======================================

export function useUpdateEmployeeLocations() {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation<
    UpdateEmployeeLocationsResponse,
    Error,
    UpdateEmployeeLocationsPayload
  >({
    mutationFn: (payload) =>
      updateEmployeeLocations(payload, selectedAreaId ?? undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: attendanceSessionKeys.list(selectedAreaId),
      });
    },
  });
}

// ======================================
// UPDATE EMPLOYEE SHIFTS
// ======================================

export function useUpdateEmployeeShifts() {
  const { selectedAreaId } = useSelectedArea();
  const queryClient = useQueryClient();

  return useMutation<
    UpdateEmployeeShiftsResponse,
    Error,
    UpdateEmployeeShiftsPayload
  >({
    mutationFn: (payload) =>
      updateEmployeeShifts(payload, selectedAreaId ?? undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: attendanceSessionKeys.list(selectedAreaId),
      });
    },
  });
}

// ======================================
// MARK ATTENDANCE SESSION
// ======================================

export function useMarkAttendanceSession() {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation<
    MarkAttendanceSessionResponse,
    Error,
    MarkAttendanceSessionPayload
  >({
    mutationFn: (payload) =>
      markAttendanceSession(payload, selectedAreaId ?? undefined),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: attendanceSessionKeys.list(selectedAreaId),
      });

      queryClient.invalidateQueries({
        queryKey: ["attendance"],
      });
    },
  });
}
