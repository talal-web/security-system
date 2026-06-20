// hooks/attendance/useTodayAttendance.ts

"use client";

import { useQuery } from "@tanstack/react-query";

import { getTodayAttendance } from "@/services/attendance.service";

export const useTodayAttendance = () => {
  return useQuery({
    queryKey: ["today-attendance"],
    queryFn: getTodayAttendance,
  });
};
