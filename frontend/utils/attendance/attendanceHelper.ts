import type { AttendanceReportSector } from "@/types/attendance-report";

export function getSectorRows(sector: AttendanceReportSector) {
  return sector.locations.flatMap((location) =>
    location.records.map((record) => ({
      location,
      record,
    })),
  );
}
