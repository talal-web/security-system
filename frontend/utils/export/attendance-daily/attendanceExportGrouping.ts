import type { AttendanceExportRow } from "@/types/attendance";

export const groupEmployeesBySectorAndLocation = (
  employees: AttendanceExportRow[],
) => {
  const groupedEmployees = new Map<string, Map<string, AttendanceExportRow[]>>();

  for (const employee of employees) {
    const sector = employee.sector ?? "-";
    const location = employee.location ?? "-";

    if (!groupedEmployees.has(sector)) {
      groupedEmployees.set(sector, new Map());
    }

    const locationMap = groupedEmployees.get(sector)!;

    if (!locationMap.has(location)) {
      locationMap.set(location, []);
    }

    locationMap.get(location)!.push(employee);
  }

  return groupedEmployees;
};
