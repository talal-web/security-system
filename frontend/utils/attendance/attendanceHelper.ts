import type { AttendanceSector } from "@/types/attendance";

export function getSectorRows(sector: AttendanceSector) {
  return sector.locations.flatMap((location) =>
    location.records.map((record) => ({
      location,
      record,
    })),
  );
}
