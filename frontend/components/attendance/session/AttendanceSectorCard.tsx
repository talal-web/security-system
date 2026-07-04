"use client";

import AttendanceEmployeeCard from "./AttendanceEmployeeCard";

import type {
  AttendanceFormEmployee,
  AttendanceFormSector,
} from "@/types/attendance-session";

interface AttendanceSectorCardProps {
  sector: AttendanceFormSector;

  selectedEmployees: Record<string, boolean>;

  setSelectedEmployees: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;

  onEmployeeChange: (
    employeeId: string,
    field: keyof AttendanceFormEmployee,
    value: unknown,
  ) => void;
}

export default function AttendanceSectorCard({
  sector,
  selectedEmployees,
  setSelectedEmployees,
  onEmployeeChange,
}: AttendanceSectorCardProps) {
  // ======================================
  // GROUP EMPLOYEES BY LOCATION
  // ======================================

  // ======================================
  // SELECT ALL
  // ======================================

  const employees = sector.locations.flatMap((location) => location.employees);

  const employeeIds = employees.map((employee) => employee.employeeId);

  const allSelected =
    employeeIds.length > 0 && employeeIds.every((id) => selectedEmployees[id]);

  const toggleSelectAll = (checked: boolean) => {
    setSelectedEmployees((prev) => {
      const next = { ...prev };

      employeeIds.forEach((id) => {
        next[id] = checked;
      });

      return next;
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* ================= HEADER ================= */}

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

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => toggleSelectAll(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Select All
          </label>
        </div>
      </div>

      <div className="p-4">
        <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {employees.map((employee) => (
            <AttendanceEmployeeCard
              key={employee.employeeId}
              employee={employee}
              locations={sector.locations}
              selected={selectedEmployees[employee.employeeId] ?? false}
              onSelect={(checked) =>
                setSelectedEmployees((prev) => ({
                  ...prev,
                  [employee.employeeId]: checked,
                }))
              }
              onUpdate={onEmployeeChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
