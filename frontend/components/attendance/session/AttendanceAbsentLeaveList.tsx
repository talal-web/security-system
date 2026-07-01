"use client";

import AttendanceAbsentLeaveCard from "./AttendanceAbsentLeaveCard";

import type {
  AttendanceFormEmployee,
  AttendanceFormSector,
} from "@/types/attendance-session";

interface AttendanceAbsentLeaveListProps {
  sectors: AttendanceFormSector[];

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

export default function AttendanceAbsentLeaveList({
  sectors,
  selectedEmployees,
  setSelectedEmployees,
  onEmployeeChange,
}: AttendanceAbsentLeaveListProps) {
  const employees = sectors.flatMap((sector) =>
    sector.employees.filter(
      (employee) => employee.status === "absent" || employee.status === "leave",
    ),
  );

  if (employees.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      {/* Header */}

      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-red-700">
              Absent & Leave
            </h2>

            <p className="text-sm text-red-600">
              Employees without duty assignment
            </p>
          </div>

          <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-red-700">
            {employees.length} Employees
          </span>
        </div>
      </div>

      {/* Cards */}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {employees.map((employee) => (
          <AttendanceAbsentLeaveCard
            key={employee.employeeId}
            employee={employee}
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
    </section>
  );
}
