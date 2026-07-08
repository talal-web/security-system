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
              selectedLocation:
                emp.selectedLocation ?? emp.currentLocation?._id ?? null,
            };
          }

          return {
            ...emp,
            status,
            shift: null,
            selectedLocation: null,
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
