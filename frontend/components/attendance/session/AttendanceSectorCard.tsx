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

  const groupedLocations = sector.locations
    .map((location) => ({
      location,
      employees: sector.employees.filter(
        (employee) => employee.selectedLocation === location._id,
      ),
    }))
    .filter((group) => group.employees.length > 0);

  const unassignedEmployees = sector.employees.filter(
    (employee) => !employee.selectedLocation,
  );

  // ======================================
  // SELECT ALL
  // ======================================

  const employeeIds = sector.employees.map((employee) => employee.employeeId);

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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ================= HEADER ================= */}

      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
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

      {/* ================= LOCATIONS ================= */}

      <div className="space-y-8 p-6">
        {groupedLocations.map(({ location, employees }) => (
          <div key={location._id}>
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-semibold text-slate-800">
                  {location.name}
                </h3>

                <p className="text-xs text-slate-500">
                  {employees.length} Employees
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
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
        ))}

        {unassignedEmployees.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-red-100 pb-2">
              <div>
                <h3 className="font-semibold text-red-700">
                  Unassigned Location
                </h3>

                <p className="text-xs text-red-500">
                  {unassignedEmployees.length} Employees
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {unassignedEmployees.map((employee) => (
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
        )}
      </div>
    </div>
  );
}
