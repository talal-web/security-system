"use client";

import AttendanceHeader from "@/components/attendance/AttendanceHeader";
import AttendanceFilters from "@/components/attendance/AttendanceFilter";
import AttendanceStats from "@/components/attendance/AttendanceStats";
import AttendanceSectorList from "@/components/attendance/AttendanceSectorList";

import { useAttendanceSessionPage } from "@/hooks/attendance/useAttendanceSessionPage";

export default function AttendanceSessionPage() {
  const attendance = useAttendanceSessionPage();

  if (attendance.isLoading) {
    return <div className="p-6">Loading attendance session...</div>;
  }

  if (attendance.error) {
    return (
      <div className="p-6 text-red-500">
        {attendance.error instanceof Error
          ? attendance.error.message
          : "Something went wrong"}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <AttendanceHeader alreadyMarked={attendance.data?.alreadyMarked} />

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
        onClearSelection={attendance.clearSelection}
        onSubmit={attendance.handleSubmit}
      />

      <AttendanceStats {...attendance.stats} />

      <AttendanceSectorList
        sectors={attendance.filteredSectors}
        selectedEmployees={attendance.selectedEmployees}
        setSelectedEmployees={attendance.setSelectedEmployees}
        onEmployeeChange={attendance.handleEmployeeChange}
      />
    </div>
  );
}
