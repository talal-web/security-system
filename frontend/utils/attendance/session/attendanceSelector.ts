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
  query: string,
  statusFilter: AttendanceStatusFilter,
) {
  const q = query.trim().toLowerCase();

  return employees.filter((employee) => {
    const matchesQuery =
      q === "" ||
      [employee.name, employee.empId, employee.fatherName, employee.designation]
        .join(" ")
        .toLowerCase()
        .includes(q);

    const matchesStatus =
      statusFilter === "all" || employee.status === statusFilter;

    return matchesQuery && matchesStatus;
  });
}

export function getPresentSectors(
  sectors: AttendanceFormSector[],
  query: string,
  statusFilter: AttendanceStatusFilter,
) {
  const q = query.trim().toLowerCase();

  return sectors
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

            if (!q) {
              return true;
            }

            return [
              employee.name,
              employee.empId,
              employee.fatherName,
              employee.designation,
              location.name,
            ]
              .join(" ")
              .toLowerCase()
              .includes(q);
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
