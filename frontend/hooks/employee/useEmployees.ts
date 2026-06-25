"use client";

import { useQuery } from "@tanstack/react-query";

import { Employee, EmployeeFilters } from "@/types/employee";

import { getEmployees } from "@/services/employee.service";

export function useEmployees(filters?: EmployeeFilters) {
  const {
    data: employees = [],
    isPending: loading,
    error,
    refetch,
  } = useQuery<Employee[]>({
    queryKey: ["employees", filters],

    queryFn: () => getEmployees(filters),
  });

  return {
    employees,
    loading,
    error: error instanceof Error ? error.message : "",
    refetch,
  };
}
