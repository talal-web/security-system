"use client";

import { useQuery } from "@tanstack/react-query";

import { getEmployeeById } from "@/services/employee.service";

import type { Employee } from "@/types/employee";

export function useEmployeeById(id: string) {
  const {
    data: employee,
    isLoading: loading,
    error,
    isError,
    refetch,
  } = useQuery<Employee>({
    queryKey: ["employee", id],

    queryFn: () => getEmployeeById(id),

    enabled: !!id,

    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    employee: employee ?? null,

    loading,

    error: isError ? "Failed to load employee" : null,

    refetch,
  };
}
