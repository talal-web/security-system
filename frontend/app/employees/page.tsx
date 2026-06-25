"use client";

import { useState } from "react";

import EmployeeCard from "@/components/employees/EmployeeCard";
import EmployeeFilters from "@/components/employees/EmployeeFilters";

import { useEmployees } from "@/hooks/employee/useEmployees";

import { EmployeeFilters as EmployeeFiltersType } from "@/types/employee-filters";

export default function EmployeesPage() {
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<EmployeeFiltersType>({
    search: "",
    status: "",
    designation: "",
    sector: "",
    defaultShift: "",
    education: "",
    hasExited: "",
  });

  const { employees, loading, error } = useEmployees(filters);

  const activeFilterCount = Object.entries(filters).filter(
    ([_, value]) => value !== "" && value !== undefined,
  ).length;

  const handleFilterChange = (
    key: keyof EmployeeFiltersType,
    value: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "",
      designation: "",
      sector: "",
      defaultShift: "",
      education: "",
      hasExited: "",
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employees</h1>

        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}

          {activeFilterCount > 0 && (
            <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-bold text-blue-600">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <EmployeeFilters
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />
      )}

      {employees.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee) => (
            <EmployeeCard key={employee._id} employee={employee} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500">
          No employees found
        </div>
      )}
    </main>
  );
}
