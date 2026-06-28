"use client";

import { useMemo, useState } from "react";

import { useDebounce } from "@/hooks/employee/useDebounce";
import { useEmployees } from "@/hooks/employee/useEmployees";

import { EmployeeFilters } from "@/types/employee";

export function useEmployeeDirectory() {
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<EmployeeFilters>({
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

  const handleFilterChange = (key: keyof EmployeeFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value as EmployeeFilters[keyof EmployeeFilters],
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

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return {
    // state
    filters,
    showFilters,

    // data
    employees,
    loading,
    isFetching,
    error,

    // computed
    employeeCount,
    activeFilterCount,

    // actions
    toggleFilters,
    handleFilterChange,
    handleClearFilters,
  };
}
