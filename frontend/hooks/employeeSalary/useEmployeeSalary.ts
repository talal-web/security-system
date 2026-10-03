import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";
import {
  createEmployeeSalary,
  getCurrentEmployeeSalary,
  getEmployeeSalaryHistory,
  updateEmployeeSalary,
} from "@/services/employeeSalary.service";

import type {
  CreateEmployeeSalaryPayload,
  UpdateEmployeeSalaryPayload,
} from "@/types/employeeSalary";

// ======================================
// Query Keys
// ======================================

export const employeeSalaryKeys = {
  all: ["employee-salary"] as const,

  area: (areaId: string) => [...employeeSalaryKeys.all, areaId] as const,

  current: (areaId: string, employeeId: string) =>
    [...employeeSalaryKeys.area(areaId), "current", employeeId] as const,

  history: (areaId: string, employeeId: string) =>
    [...employeeSalaryKeys.area(areaId), "history", employeeId] as const,
};

// ======================================
// Get Current Salary
// ======================================

export function useCurrentEmployeeSalary(employeeId?: string) {
  const { selectedAreaId } = useSelectedArea();

  return useQuery({
    queryKey:
      employeeId && selectedAreaId
        ? employeeSalaryKeys.current(selectedAreaId, employeeId)
        : [...employeeSalaryKeys.all, "current", "disabled"],

    queryFn: () => getCurrentEmployeeSalary(employeeId!, selectedAreaId!),

    enabled: !!employeeId && !!selectedAreaId,
  });
}

// ======================================
// Get Salary History
// ======================================

export function useEmployeeSalaryHistory(employeeId?: string) {
  const { selectedAreaId } = useSelectedArea();

  return useQuery({
    queryKey:
      employeeId && selectedAreaId
        ? employeeSalaryKeys.history(selectedAreaId, employeeId)
        : [...employeeSalaryKeys.all, "history", "disabled"],

    queryFn: () => getEmployeeSalaryHistory(employeeId!, selectedAreaId!),

    enabled: !!employeeId && !!selectedAreaId,
  });
}

// ======================================
// Create Salary
// ======================================

export function useCreateEmployeeSalary() {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (payload: CreateEmployeeSalaryPayload) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return createEmployeeSalary(payload, selectedAreaId);
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: employeeSalaryKeys.current(
          selectedAreaId!,
          variables.employee,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: employeeSalaryKeys.history(
          selectedAreaId!,
          variables.employee,
        ),
      });
    },
  });
}

// ======================================
// Update Salary
// ======================================

export function useUpdateEmployeeSalary(employeeId?: string) {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: ({
      salaryId,
      data,
    }: {
      salaryId: string;
      data: UpdateEmployeeSalaryPayload;
    }) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return updateEmployeeSalary(salaryId, data, selectedAreaId);
    },

    onSuccess: () => {
      if (!employeeId) return;

      queryClient.invalidateQueries({
        queryKey: employeeSalaryKeys.current(selectedAreaId!, employeeId),
      });

      queryClient.invalidateQueries({
        queryKey: employeeSalaryKeys.history(selectedAreaId!, employeeId),
      });
    },
  });
}
