"use client";

import { useQuery } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";
import { lookupEmployee } from "@/services/employee.service";

import type { EmployeeLookupResult } from "@/types/employee";

export function useEmployeeLookup(empId: string, enabled = true) {
  const { selectedAreaId } = useSelectedArea();
  const trimmedEmpId = empId.trim();

  const {
    data: employee,
    isLoading: loading,
    isFetching,
    error,
    refetch,
  } = useQuery<EmployeeLookupResult>({
    queryKey: ["employee", "lookup", selectedAreaId, trimmedEmpId],
    queryFn: () => lookupEmployee(trimmedEmpId, selectedAreaId!),
    enabled: enabled && Boolean(trimmedEmpId) && !!selectedAreaId,
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
