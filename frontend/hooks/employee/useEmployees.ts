"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { getEmployees } from "@/services/employee.service";

import type { Employee, EmployeeFilters } from "@/types/employee";

export function useEmployees(filters?: EmployeeFilters) {
  const {
    data: employees = [],
    isPending: loading,
    isFetching,
    error,
    refetch,
  } = useQuery<Employee[]>({
    queryKey: ["employees", filters],
    queryFn: () => getEmployees(filters),
    placeholderData: keepPreviousData,
  });

  return {
    employees,
    loading,
    isFetching,
    error: error instanceof Error ? error.message : "",
    refetch,
  };
}
