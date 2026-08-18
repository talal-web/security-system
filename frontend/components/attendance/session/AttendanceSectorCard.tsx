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
  /*
   * Keep the API hierarchy:
   *
   * Sector
   *   └── Location
   *         └── Employees
   *
   * Do NOT flatten locations into one employee array.
   */
  const locationsWithEmployees = [...sector.locations]
    .filter((location) => location.employees.length > 0)
    .sort((left, right) => left.sortOrder - right.sortOrder);

  const totalEmployees = locationsWithEmployees.reduce(
    (total, location) => total + location.employees.length,
    0,
  );

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
            {totalEmployees} Employees • {sector.totalLocations} Locations
          </p>
        </div>
      </div>

      {/* ================================
          LOCATIONS
      ================================= */}
      <div className="p-4">
        {locationsWithEmployees.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-500">
            No employees assigned to this sector.
          </p>
        ) : (
          <div className="space-y-6">
            {locationsWithEmployees.map((location) => (
              <section key={location._id} className="min-w-0">
                {/* =========================
                    LOCATION HEADER
                ========================= */}
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                    <span className="text-xs font-bold">
                      {location.sortOrder}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-800">
                      {location.name}
                    </h3>

                    <p className="text-[10px] font-medium text-slate-400">
                      {location.employees.length}{" "}
                      {location.employees.length === 1
                        ? "Employee"
                        : "Employees"}
                    </p>
                  </div>

                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                {/* =========================
                    LOCATION EMPLOYEES
                ========================= */}
                <div className="grid min-w-0 gap-3 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
                  {location.employees.map((employee) => (
                    <AttendanceEmployeeCard
                      key={employee.employeeId}
                      employee={employee}
                      locations={allLocations}
                      onUpdate={onEmployeeChange}
                      onLocationChange={onEmployeeLocationChange}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
