import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

  current: (employeeId: string) =>
    [...employeeSalaryKeys.all, "current", employeeId] as const,

  history: (employeeId: string) =>
    [...employeeSalaryKeys.all, "history", employeeId] as const,
};

// ======================================
// Get Current Salary
// ======================================

export function useCurrentEmployeeSalary(employeeId?: string) {
  return useQuery({
    queryKey: employeeId
      ? employeeSalaryKeys.current(employeeId)
      : [...employeeSalaryKeys.all, "current", "disabled"],

    queryFn: () => getCurrentEmployeeSalary(employeeId!),

    enabled: !!employeeId,
  });
}

// ======================================
// Get Salary History
// ======================================

export function useEmployeeSalaryHistory(employeeId?: string) {
  return useQuery({
    queryKey: employeeId
      ? employeeSalaryKeys.history(employeeId)
      : [...employeeSalaryKeys.all, "history", "disabled"],

    queryFn: () => getEmployeeSalaryHistory(employeeId!),

    enabled: !!employeeId,
  });
}

// ======================================
// Create Salary
// ======================================

export function useCreateEmployeeSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmployeeSalaryPayload) =>
      createEmployeeSalary(payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: employeeSalaryKeys.current(variables.employee),
      });

      queryClient.invalidateQueries({
        queryKey: employeeSalaryKeys.history(variables.employee),
      });
    },
  });
}

// ======================================
// Update Salary
// ======================================

export function useUpdateEmployeeSalary(employeeId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      salaryId,
      data,
    }: {
      salaryId: string;
      data: UpdateEmployeeSalaryPayload;
    }) => updateEmployeeSalary(salaryId, data),

    onSuccess: () => {
      if (!employeeId) return;

      queryClient.invalidateQueries({
        queryKey: employeeSalaryKeys.current(employeeId),
      });

      queryClient.invalidateQueries({
        queryKey: employeeSalaryKeys.history(employeeId),
      });
    },
  });
}
