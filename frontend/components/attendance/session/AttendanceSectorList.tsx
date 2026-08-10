"use client";

import AttendanceSectorCard from "./AttendanceSectorCard";

import type {
  AttendanceFormEmployee,
  AttendanceFormLocation,
  AttendanceFormSector,
} from "@/types/attendance-session";

interface AttendanceSectorListProps {
  sectors: AttendanceFormSector[];

  sectorLocations: Record<string, AttendanceFormLocation[]>;

  onEmployeeChange: (
    employeeId: string,
    field: Exclude<keyof AttendanceFormEmployee, "selectedLocation">,
    value: unknown,
  ) => void;

  onEmployeeLocationChange: (employeeId: string, locationId: string) => void;
}

export default function AttendanceSectorList({
  sectors,
  sectorLocations,
  onEmployeeChange,
  onEmployeeLocationChange,
}: AttendanceSectorListProps) {
  if (sectors.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-slate-500">
          No present employees matched the current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sectors.map((presentSector) => (
        <AttendanceSectorCard
          key={presentSector.sector._id ?? "unassigned"}
          sector={presentSector}
          allLocations={
            sectorLocations[presentSector.sector._id ?? "unassigned"] ?? []
          }
          onEmployeeChange={onEmployeeChange}
          onEmployeeLocationChange={onEmployeeLocationChange}
        />
      ))}
    </div>
  );
}
