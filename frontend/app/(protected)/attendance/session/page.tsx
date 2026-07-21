"use client";

import AttendanceHeader from "@/components/attendance/session/AttendanceHeader";
import AttendanceFilters from "@/components/attendance/session/AttendanceFilter";
import AttendanceStats from "@/components/attendance/session/AttendanceStats";
import AttendanceSectorList from "@/components/attendance/session/AttendanceSectorList";
import AttendanceAbsentLeaveList from "@/components/attendance/session/AttendanceAbsentLeaveList";

import { useAttendanceSessionPage } from "@/hooks/attendance/useAttendanceSessionPage";

export default function AttendanceSessionPage() {
  const attendance = useAttendanceSessionPage();

  if (attendance.isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  if (attendance.error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {attendance.error instanceof Error
          ? attendance.error.message
          : "Something went wrong."}
      </div>
    );
  }

  return (
    <main className="space-y-6 p-4 lg:p-6">
      <AttendanceHeader
        attendanceDate={attendance.data?.attendanceDate ?? attendance.dateValue}
        alreadyMarked={attendance.data?.alreadyMarked ?? false}
      />

      <AttendanceFilters
        dateValue={attendance.dateValue}
        query={attendance.query}
        statusFilter={attendance.statusFilter}
        isSubmitting={attendance.markAttendanceMutation.isPending}
        onDateChange={attendance.setDate}
        onQueryChange={attendance.setQuery}
        onStatusFilterChange={attendance.setStatusFilter}
        onSubmit={attendance.handleSubmit}
      />

      <AttendanceStats {...attendance.stats} />

      <AttendanceSectorList
        sectors={attendance.presentSectors}
        onEmployeeChange={attendance.handleEmployeeChange}
      />

      <AttendanceAbsentLeaveList
        absentEmployees={attendance.absentEmployees}
        leaveEmployees={attendance.leaveEmployees}
        onEmployeeChange={attendance.handleEmployeeChange}
      />
    </main>
  );
}
