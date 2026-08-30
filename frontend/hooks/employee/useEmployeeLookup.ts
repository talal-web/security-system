"use client";

import { useQuery } from "@tanstack/react-query";

import { lookupEmployee } from "@/services/employee.service";

import type { EmployeeLookupResult } from "@/types/employee";

export function useEmployeeLookup(empId: string, enabled = true) {
  const trimmedEmpId = empId.trim();

  const {
    data: employee,
    isLoading: loading,
    isFetching,
    error,
    refetch,
  } = useQuery<EmployeeLookupResult>({
    queryKey: ["employee", "lookup", trimmedEmpId],
    queryFn: () => lookupEmployee(trimmedEmpId),
    enabled: enabled && Boolean(trimmedEmpId),
    retry: false,
    staleTime: 1000 * 60 * 2,
  });

  return {
    employee: employee ?? null,
    loading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
