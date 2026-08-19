import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
};

// ======================================
// GET ATTENDANCE SESSION
// ======================================

export function useAttendanceSession() {
  return useQuery({
    queryKey: attendanceSessionKeys.all,
    queryFn: getAttendanceSession,
  });
}

// ======================================
// UPDATE EMPLOYEE LOCATIONS
// ======================================

export function useUpdateEmployeeLocations() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateEmployeeLocationsResponse,
    Error,
    UpdateEmployeeLocationsPayload
  >({
    mutationFn: updateEmployeeLocations,

    onSuccess: (data) => {
      queryClient.setQueryData(attendanceSessionKeys.all, data);
    },
  });
}

// ======================================
// UPDATE EMPLOYEE SHIFTS
// ======================================

export function useUpdateEmployeeShifts() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateEmployeeShiftsResponse,
    Error,
    UpdateEmployeeShiftsPayload
  >({
    mutationFn: updateEmployeeShifts,

    onSuccess: (data) => {
      queryClient.setQueryData(attendanceSessionKeys.all, data);
    },
  });
}

// ======================================
// MARK ATTENDANCE SESSION
// ======================================

export function useMarkAttendanceSession() {
  const queryClient = useQueryClient();

  return useMutation<
    MarkAttendanceSessionResponse,
    Error,
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
