"use client";

import AttendanceSectorCard from "./AttendanceSectorCard";

import type {
  AttendanceFormEmployee,
  AttendanceFormSector,
} from "@/types/attendance-session";

interface AttendanceSectorListProps {
  sectors: AttendanceFormSector[];
  onEmployeeChange: (
    employeeId: string,
    field: keyof AttendanceFormEmployee,
    value: unknown,
  ) => void;
}

export default function AttendanceSectorList({
  sectors,
  onEmployeeChange,
}: AttendanceSectorListProps) {
  const presentSectors = sectors
    .map((sector) => ({
      ...sector,
      locations: sector.locations
        .map((location) => ({
          ...location,
          employees: location.employees.filter(
            (employee) => employee.status === "present",
          ),
        }))
        .filter((location) => location.employees.length > 0),
    }))
    .filter((sector) => sector.locations.length > 0);

  if (presentSectors.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-slate-500">
          No employees are currently marked as Present.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {presentSectors.map((presentSector) => {
        const originalSector = sectors.find(
          (sector) => sector.sector === presentSector.sector,
        );

        return (
          <AttendanceSectorCard
            key={presentSector.sector}
            sector={presentSector}
            allLocations={originalSector?.locations ?? []}
            onEmployeeChange={onEmployeeChange}
          />
        );
      })}
    </div>
  );
}
