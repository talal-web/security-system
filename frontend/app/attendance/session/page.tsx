"use client";

import AttendanceHeader from "@/components/attendance/session/AttendanceHeader";
import AttendanceFilters from "@/components/attendance/session/AttendanceFilter";
import AttendanceStats from "@/components/attendance/session/AttendanceStats";
import AttendanceSectorList from "@/components/attendance/session/AttendanceSectorList";
import AttendanceAbsentLeaveList from "@/components/attendance/session/AttendanceAbsentLeaveList";

import { useAttendanceSessionPage } from "@/hooks/attendance/useAttendanceSessionPage";
import { useRouter } from "next/navigation";

export default function AttendanceSessionPage() {
  const attendance = useAttendanceSessionPage();
  const router = useRouter();

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
      {/* Header */}
      <AttendanceHeader
        attendanceDate={attendance.data?.attendanceDate ?? attendance.dateValue}
        alreadyMarked={attendance.data?.alreadyMarked ?? false}
      />

      {/* Filters */}
      <AttendanceFilters
        dateValue={attendance.dateValue}
        query={attendance.query}
        statusFilter={attendance.statusFilter}
        selectedCount={attendance.selectedCount}
        isSubmitting={attendance.markAttendanceMutation.isPending}
        onDateChange={attendance.setDate}
        onQueryChange={attendance.setQuery}
        onStatusFilterChange={attendance.setStatusFilter}
        onBulkPresent={() => attendance.handleBulkUpdateStatus("present")}
        onBulkAbsent={() => attendance.handleBulkUpdateStatus("absent")}
        onBulkLeave={() => attendance.handleBulkUpdateStatus("leave")}
        onClearSelection={attendance.clearSelection}
        onSubmit={attendance.handleSubmit}
        onReview={() => {
          const ok = attendance.openReview();

          if (ok) {
            router.push("/attendance/session/review");
          }
        }}
      />

      {/* Statistics */}
      <AttendanceStats {...attendance.stats} />

      {/* Present Employees */}
      <AttendanceSectorList
        sectors={attendance.sectors}
        selectedEmployees={attendance.selectedEmployees}
        setSelectedEmployees={attendance.setSelectedEmployees}
        onEmployeeChange={attendance.handleEmployeeChange}
      />

      {/* Absent & Leave */}
      <AttendanceAbsentLeaveList
        sectors={attendance.sectors}
        selectedEmployees={attendance.selectedEmployees}
        setSelectedEmployees={attendance.setSelectedEmployees}
        onEmployeeChange={attendance.handleEmployeeChange}
      />
    </main>
  );
}
