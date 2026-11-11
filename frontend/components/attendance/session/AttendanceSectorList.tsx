"use client";

import { Users } from "lucide-react";

import AttendanceSectorCard from "./AttendanceSectorCard";
import { EmptyState } from "@/components/ui/States";

import type {
  AttendanceFormEmployee,
  AttendanceFormLocation,
  AttendanceFormSector,
} from "@/types/attendance-session";

interface AttendanceSectorListProps {
  sectors: AttendanceFormSector[];

  sectorLocations: Record<string, AttendanceFormLocation[]>;
  sectorOptions: { _id: string; name: string; hasLocations: boolean }[];

  onEmployeeChange: (
    employeeId: string,
    field: Exclude<keyof AttendanceFormEmployee, "selectedLocation">,
    value: unknown,
  ) => void;

  onEmployeeLocationChange: (employeeId: string, locationId: string) => void;
  onEmployeeSectorChange: (employeeId: string, sectorId: string) => void;
}

export default function AttendanceSectorList({
  sectors,
  sectorLocations,
  sectorOptions,
  onEmployeeChange,
  onEmployeeLocationChange,
  onEmployeeSectorChange,
}: AttendanceSectorListProps) {
  if (sectors.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No present employees"
        description="No present employees matched the current filters."
      />
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
          sectorOptions={sectorOptions}
          onEmployeeChange={onEmployeeChange}
          onEmployeeLocationChange={onEmployeeLocationChange}
          onEmployeeSectorChange={onEmployeeSectorChange}
        />
      ))}
    </div>
  );
}
