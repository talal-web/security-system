import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";

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

  area: (areaId: string) => [...deductionKeys.all, areaId] as const,

  lists: (areaId: string) => [...deductionKeys.area(areaId), "list"] as const,

  list: (areaId: string, filters: DeductionFilters = {}) =>
    [...deductionKeys.lists(areaId), filters] as const,

  employee: (areaId: string, employeeId: string) =>
    [...deductionKeys.area(areaId), "employee", employeeId] as const,
};

// ======================================
// Get All Deductions
// ======================================

export function useDeductions(filters: DeductionFilters = {}) {
  const { selectedAreaId } = useSelectedArea();
  const effectiveFilters = {
    ...filters,
    area: selectedAreaId ?? undefined,
  };

  return useQuery({
    queryKey: selectedAreaId
      ? deductionKeys.list(selectedAreaId, effectiveFilters)
      : [...deductionKeys.all, "disabled", "list"],
    queryFn: () => getDeductions(effectiveFilters),
    enabled: !!selectedAreaId,
  });
}

// ======================================
// Get Employee Deductions
// ======================================

export function useEmployeeDeductions(employeeId?: string) {
  const { selectedAreaId } = useSelectedArea();

  return useQuery({
    queryKey:
      employeeId && selectedAreaId
        ? deductionKeys.employee(selectedAreaId, employeeId)
        : [...deductionKeys.all, "employee", "disabled"],

    queryFn: () => getEmployeeDeductions(employeeId!, selectedAreaId!),

    enabled: Boolean(employeeId) && !!selectedAreaId,
  });
}

// ======================================
// Create Deduction
// ======================================

export function useCreateDeduction() {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (payload: CreateDeductionPayload) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return createDeduction(payload, selectedAreaId);
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: deductionKeys.lists(selectedAreaId!),
      });

      queryClient.invalidateQueries({
        queryKey: deductionKeys.employee(selectedAreaId!, variables.employee),
      });
    },
  });
}

// ======================================
// Update Deduction
// ======================================

export function useUpdateDeduction(employeeId?: string) {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: ({
      deductionId,
      data,
    }: {
      deductionId: string;
      data: UpdateDeductionPayload;
    }) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return updateDeduction(deductionId, data, selectedAreaId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: deductionKeys.lists(selectedAreaId!),
      });

      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: deductionKeys.employee(selectedAreaId!, employeeId),
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
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (deductionId: string) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return cancelDeduction(deductionId, selectedAreaId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: deductionKeys.lists(selectedAreaId!),
      });

      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: deductionKeys.employee(selectedAreaId!, employeeId),
        });
      }
    },
  });
}
