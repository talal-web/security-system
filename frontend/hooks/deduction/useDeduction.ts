import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  cancelDeduction,
  createDeduction,
  getDeductions,
  getEmployeeDeductions,
  updateDeduction,
} from "@/services/deduction.service";

import type {
  CreateDeductionPayload,
  DeductionFilters,
  UpdateDeductionPayload,
} from "@/types/deduction";

// ======================================
// Query Keys
// ======================================

export const deductionKeys = {
  all: ["deductions"] as const,

  lists: () => [...deductionKeys.all, "list"] as const,

  list: (filters: DeductionFilters = {}) =>
    [...deductionKeys.lists(), filters] as const,

  employee: (employeeId: string) =>
    [...deductionKeys.all, "employee", employeeId] as const,
};

// ======================================
// Get All Deductions
// ======================================

export function useDeductions(filters: DeductionFilters = {}) {
  return useQuery({
    queryKey: deductionKeys.list(filters),
    queryFn: () => getDeductions(filters),
  });
}

// ======================================
// Get Employee Deductions
// ======================================

export function useEmployeeDeductions(employeeId?: string) {
  return useQuery({
    queryKey: employeeId
      ? deductionKeys.employee(employeeId)
      : [...deductionKeys.all, "employee", "disabled"],

    queryFn: () => getEmployeeDeductions(employeeId!),

    enabled: Boolean(employeeId),
  });
}

// ======================================
// Create Deduction
// ======================================

export function useCreateDeduction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDeductionPayload) => createDeduction(payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: deductionKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: deductionKeys.employee(variables.employee),
      });
    },
  });
}

// ======================================
// Update Deduction
// ======================================

export function useUpdateDeduction(employeeId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      deductionId,
      data,
    }: {
      deductionId: string;
      data: UpdateDeductionPayload;
    }) => updateDeduction(deductionId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: deductionKeys.lists(),
      });

      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: deductionKeys.employee(employeeId),
        });
      }
    },
  });
}

// ======================================
// Cancel Deduction
// ======================================

export function useCancelDeduction(employeeId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deductionId: string) => cancelDeduction(deductionId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: deductionKeys.lists(),
      });

      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: deductionKeys.employee(employeeId),
        });
      }
    },
  });
}
