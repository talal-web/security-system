"use client";

import AttendanceEmployeeCard from "@/components/attendance/AttendanceEmployeeCard";

import { AttendanceFormEmployee } from "@/types/attendance-session";

import { formatSectorName } from "@/lib/utils";

interface Sector {
  sector: string;

  totalLocations: number;

  locations: {
    _id: string;
    name: string;
  }[];

  employees: AttendanceFormEmployee[];
}

interface AttendanceSectorListProps {
  sectors: Sector[];

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

export default function AttendanceSectorList({
  sectors,
  selectedEmployees,
  setSelectedEmployees,
  onEmployeeChange,
}: AttendanceSectorListProps) {
  return (
    <div className="space-y-6">
      {sectors.map((sector) => (
        <section key={sector.sector} className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-lg font-semibold">
                {formatSectorName(sector.sector)}
              </p>

              <p className="text-sm text-slate-500">
                {sector.employees.length} employee
                {sector.employees.length > 1 ? "s" : ""}
              </p>
            </div>

            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {sector.totalLocations} locations
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {sector.employees.map((employee) => (
              <AttendanceEmployeeCard
                key={employee.employeeId}
                employee={employee}
                locations={sector.locations}
                selected={!!selectedEmployees[employee.employeeId]}
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
      ))}
    </div>
  );
}
