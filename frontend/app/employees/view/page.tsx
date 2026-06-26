"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useDebounce } from "@/hooks/employee/useDebounce";

import EmployeeCard from "@/components/employees/EmployeeCard";
import EmployeeFilters from "@/components/employees/EmployeeFilters";

import { useEmployees } from "@/hooks/employee/useEmployees";

import { EmployeeFilters as EmployeeFiltersType } from "@/types/employee";

export default function EmployeesPage() {
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<EmployeeFiltersType>({
    search: "",
    status: "active",
    designation: undefined,
    sector: undefined,
    defaultShift: undefined,
    education: undefined,
    unassigned: undefined,
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const queryFilters = useMemo(
    () => ({
      search: debouncedSearch,
      status: filters.status,
      designation: filters.designation,
      sector: filters.sector,
      defaultShift: filters.defaultShift,
      education: filters.education,
      unassigned: filters.unassigned,
    }),
    [
      debouncedSearch,
      filters.status,
      filters.designation,
      filters.sector,
      filters.defaultShift,
      filters.education,
      filters.unassigned,
    ],
  );

  const { employees, loading, isFetching, error } = useEmployees(queryFilters);

  const employeeCount = employees.length;

  const activeFilterCount = useMemo(
    () =>
      Object.entries(filters).filter(([key, value]) => {
        if (key === "status") {
          return value === "inactive";
        }

        return value !== "" && value !== undefined;
      }).length,
    [filters],
  );

  const handleFilterChange = (
    key: keyof EmployeeFiltersType,
    value: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value as EmployeeFiltersType[keyof EmployeeFiltersType],
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "active",
      designation: undefined,
      sector: undefined,
      defaultShift: undefined,
      education: undefined,
      unassigned: undefined,
    });
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
    <main className="p-4">
      <div className="mb-6 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Employee directory
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Filter and browse employees by status, sector, shift, and
              assignment state.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              {showFilters ? "Hide filters" : "Show filters"}
            </button>

            <Link
              href="/employees/create"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              <Plus className="h-4 w-4" />
              Add employee
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700 shadow-sm">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Total employees
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">
              {employeeCount}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700 shadow-sm">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Active filters
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">
              {activeFilterCount}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700 shadow-sm">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Status
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">
              {isFetching ? "Refreshing" : "Live"}
            </div>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="font-medium text-slate-900">Active filters:</span>
            <span>{activeFilterCount} selected</span>
            <button
              type="button"
              onClick={handleClearFilters}
              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className={showFilters ? "mb-6 block" : "mb-6 hidden"}>
        <EmployeeFilters
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />
      </div>

      {employees.length > 0 ? (
        <div className="relative mt-4">
          {isFetching && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/40 backdrop-blur-[1px]">
              <div className="rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow">
                Updating employees...
              </div>
            </div>
          )}

          <div
            className={`grid grid-cols-1 gap-4 transition-opacity duration-200 md:grid-cols-2 lg:grid-cols-3 ${
              isFetching ? "pointer-events-none opacity-60" : "opacity-100"
            }`}
          >
            {employees.map((employee) => (
              <EmployeeCard key={employee._id} employee={employee} />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500">
          {isFetching ? "Updating employees..." : "No employees found"}
        </div>
      )}
    </main>
  );
}
