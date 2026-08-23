import type {
  AttendanceFormEmployee,
  AttendanceFormSector,
} from "@/types/attendance-session";

export function moveAttendanceEmployee(
  sectors: AttendanceFormSector[],
  employeeId: string,
  locationId: string,
): AttendanceFormSector[] {
  let employee: AttendanceFormEmployee | null = null;

  // 1. Remove employee from current location
  const next = sectors.map((sector) => ({
    ...sector,

    locations: sector.locations.map((location) => {
      const remainingEmployees = location.employees.filter((emp) => {
        if (emp.employeeId !== employeeId) {
          return true;
        }

        employee = {
          ...emp,
          selectedLocation: locationId,
        };

        return false;
      });

      return {
        ...location,
        employeeCount: remainingEmployees.length,
        employees: remainingEmployees,
      };
    }),
  }));

  // Employee was not found
  if (!employee) {
    return sectors;
  }

  const employeeToMove: AttendanceFormEmployee = employee;

  // 2. Add employee to new location
  return next.map((sector) => ({
    ...sector,

    locations: sector.locations.map((location) => {
      if (location._id !== locationId) {
        return location;
      }

      return {
        ...location,
        employeeCount: location.employeeCount + 1,
        employees: [...location.employees, employeeToMove],
      };
    }),
  }));
}
