"use client";

import Link from "next/link";
import { Plus, Filter } from "lucide-react";

import EmployeeCard from "@/components/employees/view/EmployeeCard";
import EmployeeFilters from "@/components/employees/EmployeeFilters";

import { useEmployeeDirectory } from "@/hooks/employee/useEmployeeDirectory";

export default function EmployeesPage() {
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
    <main className="space-y-3 p-4">
      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-20 rounded-2xl border border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Left */}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-bold text-slate-900">
              Employee Directory
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {/* Employee Count */}
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                👥 {employeeCount} Employees
              </span>

              {/* Filters */}
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  activeFilterCount > 0
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                🔍 {activeFilterCount} Filter
                {activeFilterCount !== 1 ? "s" : ""}
              </span>

              {/* Live Status */}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isFetching
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isFetching ? "bg-amber-500" : "bg-green-500"
                  }`}
                />

                {isFetching ? "Refreshing" : "Live"}
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            <button
              onClick={toggleFilters}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition sm:w-auto ${
                showFilters
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    showFilters
                      ? "bg-white/20 text-white"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            <Link
              href="/employees/create"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add Employee
            </Link>
          </div>
        </div>
      </div>

      {/* ================= FILTER PANEL ================= */}
      {showFilters && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
  );
}
