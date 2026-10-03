"use client";

import { useQuery } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";
import { getEmployees } from "@/services/employee.service";

import type { Employee, EmployeeFilters } from "@/types/employee";

export function useEmployees(filters?: EmployeeFilters) {
  const { selectedAreaId } = useSelectedArea();
  const effectiveFilters = {
    ...filters,
    area: selectedAreaId ?? undefined,
  };

  const {
    data: employees = [],
    isPending: loading,
    isFetching,
    error,
    refetch,
  } = useQuery<Employee[]>({
    queryKey: ["employees", selectedAreaId, effectiveFilters],
    queryFn: () => getEmployees(effectiveFilters),
    enabled: !!selectedAreaId,
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[1] === selectedAreaId ? previousData : undefined,
  });

  return {
    employees,
    loading,
    isFetching,
    error: error instanceof Error ? error.message : "",
    refetch,
  };
}
