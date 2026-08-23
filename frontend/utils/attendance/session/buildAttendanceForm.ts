import type {
  AttendanceFormEmployee,
  AttendanceFormLocation,
  AttendanceFormSector,
  AttendanceSessionSector,
} from "@/types/attendance-session";

export function buildAttendanceForm(
  sectors: AttendanceSessionSector[],
): AttendanceFormSector[] {
  return sectors.map((sector) => ({
    sector: sector.sector,
    totalEmployees: sector.totalEmployees,
    totalLocations: sector.totalLocations,

    locations: sector.locations.map(
      (location): AttendanceFormLocation => ({
        ...location,

        employees: location.employees.map(
          (employee): AttendanceFormEmployee => ({
            ...employee,

            sector: sector.sector._id ?? null,

            currentLocation: location._id,

            selectedLocation: location._id,

            status: "present",

            shift: employee.defaultShift ?? null,

            remarks: "",
          }),
        ),
      }),
    ),
  }));
}
