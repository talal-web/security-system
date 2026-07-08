"use client";

import AttendanceEmployeeCard from "./AttendanceEmployeeCard";

import type {
  AttendanceFormEmployee,
  AttendanceFormSector,
} from "@/types/attendance-session";

interface AttendanceSectorCardProps {
  sector: AttendanceFormSector;
  allLocations: AttendanceFormSector["locations"];
  onEmployeeChange: (
    employeeId: string,
    field: keyof AttendanceFormEmployee,
    value: unknown,
  ) => void;
}

export default function AttendanceSectorCard({
  sector,
  allLocations,
  onEmployeeChange,
}: AttendanceSectorCardProps) {
  const employees = sector.locations.flatMap((location) => location.employees);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {sector.sector}
            </h2>

            <p className="text-sm text-slate-500">
              {sector.totalEmployees} Employees • {sector.totalLocations}{" "}
              Locations
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {employees.map((employee) => (
            <AttendanceEmployeeCard
              key={employee.employeeId}
              employee={employee}
              locations={allLocations}
              onUpdate={onEmployeeChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
