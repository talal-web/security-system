import { useState } from "react";

import { exportAttendanceToExcel } from "@/utils/export/AttendanceDaily";

import {
  mapAttendanceEmployee,
  mapPresentEmployees,
} from "@/utils/attendance/attendanceMapper";

import type {
  AttendanceReportAbsentLeaveEmployee,
  AttendanceReportGlobalStats,
  AttendanceReportSector,
} from "@/types/attendance-report";

interface ExportAttendanceParams {
  globalStats?: AttendanceReportGlobalStats;
  presentSectors: AttendanceReportSector[];
  absentEmployees: AttendanceReportAbsentLeaveEmployee[];
  leaveEmployees: AttendanceReportAbsentLeaveEmployee[];
  date: string;
}

export function useAttendanceExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportAll = async ({
    globalStats,
    presentSectors,
    absentEmployees,
    leaveEmployees,
    date,
  }: ExportAttendanceParams) => {
    setIsExporting(true);

    try {
      const presentMapped = mapPresentEmployees(presentSectors);

      const absentMapped = absentEmployees.map((employee) =>
        mapAttendanceEmployee(employee, "absent"),
      );

      const leaveMapped = leaveEmployees.map((employee) =>
        mapAttendanceEmployee(employee, "leave"),
      );

      await exportAttendanceToExcel({
        employees: [...presentMapped, ...absentMapped, ...leaveMapped],
        globalStats,
        title: `Attendance - ${date}`,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportAll,
    isExporting,
  };
}
