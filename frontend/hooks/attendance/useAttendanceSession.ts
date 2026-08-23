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
  return useMutation<
    UpdateEmployeeLocationsResponse,
    Error,
    UpdateEmployeeLocationsPayload
  >({
    mutationFn: updateEmployeeLocations,
  });
}

// ======================================
// UPDATE EMPLOYEE SHIFTS
// ======================================

export function useUpdateEmployeeShifts() {
  return useMutation<
    UpdateEmployeeShiftsResponse,
    Error,
    UpdateEmployeeShiftsPayload
  >({
    mutationFn: updateEmployeeShifts,
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
