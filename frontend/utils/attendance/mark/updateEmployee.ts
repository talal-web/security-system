import type {
  AttendanceFormEmployee,
  AttendanceFormSector,
} from "@/types/attendance-session";

export function updateEmployee(
  sectors: AttendanceFormSector[],
  employeeId: string,
  field: keyof AttendanceFormEmployee,
  value: unknown,
): AttendanceFormSector[] {
  return sectors.map((sector) => ({
    ...sector,
    locations: sector.locations.map((location) => ({
      ...location,
      employees: location.employees.map((emp) => {
        if (emp.employeeId !== employeeId) {
          return emp;
        }

        if (field === "status") {
          const status = value as AttendanceFormEmployee["status"];

          if (status === "present") {
            return {
              ...emp,
              status,
              shift: emp.defaultShift ?? null,
              selectedLocation: emp.selectedLocation ?? emp.currentLocation,
            };
          }

          return {
            ...emp,
            status,
            shift: null,
            selectedLocation: null,
            currentLocation: emp.currentLocation,
          };
        }

        if (field === "currentLocation") {
          const nextLocation = value as string | null;

          return {
            ...emp,
            currentLocation: nextLocation,
            selectedLocation: nextLocation ?? emp.selectedLocation,
          };
        }

        if (field === "sector") {
          return {
            ...emp,
            sector: value as string | null,
          };
        }

        return {
          ...emp,
          [field]: value,
        };
      }),
    })),
  }));
}
