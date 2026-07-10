import { useState } from "react";

import { exportAttendanceToExcel } from "@/utils/exportExcel";

import {
  mapAttendanceEmployee,
  mapPresentEmployees,
} from "@/utils/attendance/attendanceMapper";

import type {
  AttendanceGlobalStats,
  AttendanceNonPresentEmployee,
  AttendanceSector,
} from "@/types/attendance";

interface ExportAttendanceParams {
  globalStats?: AttendanceGlobalStats;
  presentSectors: AttendanceSector[];
  absentEmployees: AttendanceNonPresentEmployee[];
  leaveEmployees: AttendanceNonPresentEmployee[];
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
