// src/hooks/useEmployees.ts

"use client";

import { useQuery } from "@tanstack/react-query";

import { Employee } from "@/types/employee";
import { getEmployees } from "@/services/employeeService";

export function useEmployees() {
  const {
    data: employees = [],
    isPending: loading,
    error,
    isError,
    refetch,
  } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  return {
    employees,
    loading,
    error: isError ? "Failed to fetch employees" : "",
    refetch,
  };
}
