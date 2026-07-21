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
      {sectors.map((presentSector) => {
        return (
          <AttendanceSectorCard
            key={presentSector.sector}
            sector={presentSector}
            allLocations={presentSector.locations}
            onEmployeeChange={onEmployeeChange}
          />
        );
      })}
    </div>
  );
}
