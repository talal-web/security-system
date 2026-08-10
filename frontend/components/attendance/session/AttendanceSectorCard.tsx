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
    field: Exclude<keyof AttendanceFormEmployee, "selectedLocation">,
    value: unknown,
  ) => void;

  onEmployeeLocationChange: (employeeId: string, locationId: string) => void;
}

export default function AttendanceSectorCard({
  sector,
  allLocations,
  onEmployeeChange,
  onEmployeeLocationChange,
}: AttendanceSectorCardProps) {
  const employees = sector.locations.flatMap((location) => location.employees);

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* ================================
          SECTOR HEADER
      ================================= */}
      <div className="border-b bg-slate-50 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {sector.sector.name}
          </h2>

          <p className="text-sm text-slate-500">
            {sector.totalEmployees} Employees • {sector.totalLocations}{" "}
            Locations
          </p>
        </div>
      </div>

      {/* ================================
          EMPLOYEES
      ================================= */}
      <div className="p-4">
        {employees.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-500">
            No employees assigned to this sector.
          </p>
        ) : (
          <div className="grid gap-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
            {employees.map((employee) => (
              <AttendanceEmployeeCard
                key={employee.employeeId}
                employee={employee}
                locations={allLocations}
                onUpdate={onEmployeeChange}
                onLocationChange={onEmployeeLocationChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
