"use client";

import { useQuery } from "@tanstack/react-query";

import { getEmployeeById } from "@/services/employee.service";
import { useSelectedArea } from "@/components/area/AreaContext";

import type { Employee } from "@/types/employee";

export function useEmployeeById(id: string) {
  const { selectedAreaId } = useSelectedArea();

  const {
    data: employee,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<Employee>({
    queryKey: ["employee", id, selectedAreaId],

    queryFn: () => getEmployeeById(id, selectedAreaId!),

    enabled: !!id && !!selectedAreaId,

    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    employee: employee ?? null,

    loading,

    error: error instanceof Error ? error.message : null,

    refetch,
  };
}
