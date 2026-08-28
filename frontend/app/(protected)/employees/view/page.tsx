"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Filter, Download } from "lucide-react";

import EmployeeCard from "@/components/employees/view/EmployeeCard";
import EmployeeFilters from "@/components/employees/EmployeeFilters";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

import { useEmployeeDirectory } from "@/hooks/employee/useEmployeeDirectory";
import { exportEmployeesDirectory } from "@/utils/export/EmployeesDirectory";

export default function EmployeesPage() {
  const [exporting, setExporting] = useState(false);

  const {
    filters,
    showFilters,

    employees,
    loading,
    isFetching,
    error,

    employeeCount,
    activeFilterCount,

    toggleFilters,
    handleFilterChange,
    handleClearFilters,
  } = useEmployeeDirectory();

  const handleExport = async () => {
    if (exporting || employees.length === 0) return;

    try {
      setExporting(true);
      await exportEmployeesDirectory({ employees });
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading employees...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <ProtectedRoute
      allowedRoles={["developer", "admin", "clerk", "supervisor"]}
    >
      <main className="space-y-3 p-4">
        {/* ================= HEADER ================= */}
        <div className="sticky top-0 z-20 rounded-2xl border border-slate-200 bg-white/95 shadow-sm backdrop-blur">
          <div className="flex h-16 items-center gap-2 px-3 sm:h-auto sm:px-5 sm:py-3">
            {/* LEFT SIDE */}
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {/* Stats */}
              <div className="flex shrink-0 items-center gap-1">
                {/* Employees */}
                <span className="inline-flex h-7 items-center rounded-full bg-slate-100 px-2 text-[10px] font-semibold text-slate-700 sm:h-auto sm:px-3 sm:py-1 sm:text-xs">
                  👥 {employeeCount}
                  <span className="ml-1 hidden sm:inline">Employees</span>
                </span>

                {/* Filters */}
                <span
                  className={`inline-flex h-7 items-center rounded-full px-2 text-[10px] font-semibold sm:h-auto sm:px-3 sm:py-1 sm:text-xs ${
                    activeFilterCount > 0
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  🔍 {activeFilterCount}
                  <span className="ml-1 sm:inline">
                    Filter{activeFilterCount !== 1 ? "s" : ""}
                  </span>
                </span>

                {/* Live */}
                <span
                  className={`inline-flex h-7 items-center gap-1 rounded-full px-2 text-[10px] font-semibold sm:h-auto sm:px-2.5 sm:py-0.5 sm:text-xs ${
                    isFetching
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isFetching ? "bg-amber-500" : "bg-green-500"
                    }`}
                  />

                  <span className=" sm:inline">
                    {isFetching ? "Searching..." : "Live"}
                  </span>
                </span>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex shrink-0 items-center gap-2">
              {/* FILTER */}
              <button
                onClick={toggleFilters}
                title="Filters"
                aria-label="Filters"
                className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-3 ${
                  showFilters
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Filter className="h-4 w-4" />

                <span className="hidden sm:inline text-sm font-semibold">
                  Filters
                </span>

                {activeFilterCount > 0 && (
                  <span
                    className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold sm:static sm:h-auto sm:min-w-0 sm:px-2 sm:py-0.5 sm:text-[10px] ${
                      showFilters
                        ? "bg-white text-slate-900 sm:bg-white/20 sm:text-white"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {/* EXPORT */}
              <button
                onClick={handleExport}
                disabled={exporting || employees.length === 0}
                title="Export Employees"
                aria-label="Export Employees"
                className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:flex sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-3"
              >
                <Download
                  className={`h-4 w-4 ${exporting ? "animate-bounce" : ""}`}
                />

                <span className="text-sm font-semibold">
                  {exporting ? "Exporting..." : "Export"}
                </span>
              </button>

              {/* ADD EMPLOYEE */}
              <Link
                href="/employees/create"
                title="Add Employee"
                aria-label="Add Employee"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white transition hover:bg-orange-700 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-3"
              >
                <Plus className="h-4 w-4" />

                <span className="hidden text-sm font-semibold sm:inline">
                  Add Employee
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ================= FILTER PANEL ================= */}
        {showFilters && (
          <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm sm:p-4">
            <EmployeeFilters
              filters={filters}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>
        )}

        {/* ================= EMPLOYEE LIST ================= */}
        <div className="relative">
          {/* Loading Overlay */}
          {isFetching && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/40 backdrop-blur-[2px]">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-lg">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />

                <span className="text-sm font-medium text-slate-700">
                  Updating employees...
                </span>
              </div>
            </div>
          )}

          {employees.length > 0 ? (
            <>
              {/* Employee Cards */}
              <div
                className={`grid grid-cols-1 gap-3 transition-opacity duration-200 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 ${
                  isFetching ? "pointer-events-none opacity-60" : "opacity-100"
                }`}
              >
                {employees.map((employee) => (
                  <EmployeeCard key={employee._id} employee={employee} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex min-h-70 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center">
              <div className="mb-2 text-4xl">👤</div>

              <h3 className="text-lg font-semibold text-slate-800">
                No employees found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {activeFilterCount > 0
                  ? "Try adjusting or clearing the current filters."
                  : "Create your first employee to get started."}
              </p>

              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
