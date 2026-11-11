"use client";

import { useState } from "react";
import { CalendarDays, Download, Users } from "lucide-react";

import { useAttendanceReport } from "@/hooks/attendance/useAttendanceReport";
import { useAttendanceExport } from "@/hooks/attendance/useAttendanceExport";
import type { AttendanceFilters as AttendanceFiltersType } from "@/types/attendance";
import { getSectorRows } from "@/utils/attendance/attendanceHelper";
import {
  getShiftStyle,
  getStatusStyle,
} from "@/utils/attendance/attendanceStyles";
import { getTodayDate } from "@/utils/attendance/date";
import { Button } from "@/components/ui/Button";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";

import AttendanceEmployeeTable from "./view/AttendanceEmployeeTable";
import AttendanceFilters from "./view/AttendanceFilters";
import AttendanceSectorTable from "./view/AttendanceSectorTable";
import AttendanceStats from "./view/AttendanceStats";

export default function AttendanceReport() {
  const [filters, setFilters] = useState<AttendanceFiltersType>(() => ({
    date: getTodayDate(),
  }));

  const { data, isLoading, error } = useAttendanceReport(filters);
  const globalStats = data?.data?.globalStats;
  const presentSectors = data?.data?.presentSectors ?? [];
  const absentEmployees = data?.data?.absentEmployees ?? [];
  const leaveEmployees = data?.data?.leaveEmployees ?? [];
  const { exportAll, isExporting } = useAttendanceExport();

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState title="Loading attendance report..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          description={error.message || "Failed to load attendance."}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Attendance Report"
        description="Workforce snapshot"
        icon={CalendarDays}
        actions={
          <Button
            onClick={() =>
              exportAll({
                globalStats,
                presentSectors,
                absentEmployees,
                leaveEmployees,
                date: filters.date ?? "",
              })
            }
            disabled={isExporting}
          >
            <Download />
            {isExporting ? "Exporting..." : "Export All"}
          </Button>
        }
      />

      {globalStats && <AttendanceStats stats={globalStats} />}

      <AttendanceFilters filters={filters} setFilters={setFilters} />

      {presentSectors.length > 0 ? (
        <div className="space-y-4">
          {presentSectors.map((sector) => (
            <AttendanceSectorTable
              key={sector.sectorId || sector.sector}
              sector={sector}
              getSectorRows={getSectorRows}
              getStatusStyle={getStatusStyle}
              getShiftStyle={getShiftStyle}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No present employees found."
        />
      )}

      {absentEmployees.length > 0 && (
        <AttendanceEmployeeTable
          title="Absent Employees"
          status="absent"
          employees={absentEmployees}
        />
      )}

      {leaveEmployees.length > 0 && (
        <AttendanceEmployeeTable
          title="Leave Employees"
          status="leave"
          employees={leaveEmployees}
        />
      )}
    </PageContainer>
  );
}
