"use client";

import { useQuery } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";
import { useMe } from "@/hooks/auth/useMe";
import { attendanceKeys } from "@/hooks/attendance/useAttendance";
import { payrollKeys } from "@/hooks/payroll/usePayroll";
import { getAttendanceReport } from "@/services/attendance.service";
import { getPayrolls } from "@/services/payroll.service";
import { getTodayDate } from "@/utils/date/getDefaultFilerDate";

import type { UserRole } from "@/types/user";

const ATTENDANCE_ROLES: UserRole[] = ["developer", "admin", "clerk"];

/**
 * Read-only summaries for the dashboard and notification menu: today's
 * attendance report and this month's payroll list for the selected area.
 * Uses the same query keys as the page hooks, so data is shared and cached.
 * Queries only run for roles whose pages already expose this data.
 */
export function useWorkspaceInsights() {
  const { selectedAreaId } = useSelectedArea();
  const { data: me } = useMe();
  const role = me?.user?.role;

  const today = getTodayDate();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const canSeeAttendance = !!role && ATTENDANCE_ROLES.includes(role);

  const attendanceFilters = { date: today, area: selectedAreaId ?? undefined };
  const attendance = useQuery({
    queryKey: attendanceKeys.list(attendanceFilters),
    queryFn: () => getAttendanceReport(attendanceFilters, selectedAreaId!),
    enabled: canSeeAttendance && !!selectedAreaId,
    staleTime: 1000 * 60,
  });

  const payrollFilters = { year, month, area: selectedAreaId ?? undefined };
  const payroll = useQuery({
    queryKey: selectedAreaId
      ? payrollKeys.list(selectedAreaId, payrollFilters)
      : [...payrollKeys.all, "disabled", "insights"],
    queryFn: () => getPayrolls(payrollFilters, selectedAreaId!),
    enabled: !!role && !!selectedAreaId,
    staleTime: 1000 * 60,
  });

  const payrolls = payroll.data?.data ?? [];

  const payrollStats = {
    total: payrolls.length,
    draft: payrolls.filter((p) => p.status === "draft").length,
    finalized: payrolls.filter((p) => p.status === "finalized").length,
    paid: payrolls.filter((p) => p.status === "paid").length,
    netTotal: payrolls.reduce((sum, p) => sum + (p.netSalary ?? 0), 0),
    paidTotal: payrolls
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + (p.netSalary ?? 0), 0),
  };

  return {
    year,
    month,
    today,
    canSeeAttendance,
    attendance,
    attendanceStats: attendance.data?.data?.globalStats,
    payroll,
    payrolls,
    payrollStats,
  };
}
