"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";
import { getEmployees } from "@/services/employee.service";

import type { Employee, EmployeeFilters } from "@/types/employee";

export function useEmployees(filters?: EmployeeFilters) {
  const { selectedAreaId } = useSelectedArea();
  const effectiveFilters = {
    ...filters,
    ...(selectedAreaId && !filters?.area ? { area: selectedAreaId } : {}),
  };

  const {
    data: employees = [],
    isPending: loading,
    isFetching,
    error,
    refetch,
  } = useQuery<Employee[]>({
    queryKey: ["employees", effectiveFilters],
    queryFn: () => getEmployees(effectiveFilters),
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
