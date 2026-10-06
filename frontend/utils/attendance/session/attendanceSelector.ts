import type {
  AttendanceFormEmployee,
  AttendanceFormSector,
} from "@/types/attendance-session";

export function getAllEmployees(
  sectors: AttendanceFormSector[],
): AttendanceFormEmployee[] {
  return sectors.flatMap((sector) =>
    sector.locations.flatMap((location) => location.employees),
  );
}

export function getAttendanceStats(employees: AttendanceFormEmployee[]) {
  return {
    total: employees.length,
    present: employees.filter((e) => e.status === "present").length,
    absent: employees.filter((e) => e.status === "absent").length,
    leave: employees.filter((e) => e.status === "leave").length,
  };
}

export function getPresentEmployees(employees: AttendanceFormEmployee[]) {
  return employees.filter((employee) => employee.status === "present");
}

export function getAbsentEmployees(employees: AttendanceFormEmployee[]) {
  return employees.filter((employee) => employee.status === "absent");
}

export function getLeaveEmployees(employees: AttendanceFormEmployee[]) {
  return employees.filter((employee) => employee.status === "leave");
}

export type AttendanceStatusFilter = "all" | "present" | "absent" | "leave";

export function filterAttendanceEmployees(
  employees: AttendanceFormEmployee[],
  statusFilter: AttendanceStatusFilter,
  sectorFilter: string,
) {
  return employees.filter((employee) => {
    const matchesStatus =
      statusFilter === "all" || employee.status === statusFilter;
    const matchesSector =
      sectorFilter === "all" || employee.sector === sectorFilter;

    return matchesStatus && matchesSector;
  });
}

export function getPresentSectors(
  sectors: AttendanceFormSector[],
  statusFilter: AttendanceStatusFilter,
  sectorFilter: string,
) {
  return sectors
    .filter(
      (sector) =>
        sectorFilter === "all" || sector.sector._id === sectorFilter,
    )
    .map((sector) => ({
      ...sector,

      locations: sector.locations
        .map((location) => ({
          ...location,

          employees: location.employees.filter((employee) => {
            if (employee.status !== "present") {
              return false;
            }

            if (statusFilter !== "all" && statusFilter !== "present") {
              return false;
            }

            return true;
          }),
        }))
        .filter((location) => location.employees.length > 0),
    }))
    .filter((sector) => sector.locations.length > 0);
}

export function getVisibleEmployeeCount(
  presentSectors: AttendanceFormSector[],
  absentEmployees: AttendanceFormEmployee[],
  leaveEmployees: AttendanceFormEmployee[],
) {
  const presentCount = presentSectors.reduce(
    (total, sector) =>
      total +
      sector.locations.reduce(
        (count, location) => count + location.employees.length,
        0,
      ),
    0,
  );

  return presentCount + absentEmployees.length + leaveEmployees.length;
}
