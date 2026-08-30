import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  cancelAdvance,
  createAdvance,
  getAdvances,
  getEmployeeAdvances,
  updateAdvance,
} from "@/services/advance.service";

import type {
  AdvanceFilters,
  CreateAdvancePayload,
  UpdateAdvancePayload,
} from "@/types/advance";

// ======================================
// Query Keys
// ======================================

export const advanceKeys = {
  all: ["advances"] as const,

  lists: () => [...advanceKeys.all, "list"] as const,

  list: (filters?: AdvanceFilters) =>
    [...advanceKeys.lists(), filters ?? {}] as const,

  employee: (employeeId: string) =>
    [...advanceKeys.all, "employee", employeeId] as const,
};

// ======================================
// Get All Advances
// ======================================

export function useAdvances(filters?: AdvanceFilters) {
  return useQuery({
    queryKey: advanceKeys.list(filters),
    queryFn: () => getAdvances(filters),
  });
}

// ======================================
// Get Employee Advances
// ======================================

export function useEmployeeAdvances(employeeId?: string) {
  return useQuery({
    queryKey: employeeId
      ? advanceKeys.employee(employeeId)
      : [...advanceKeys.all, "employee", "disabled"],

    queryFn: () => getEmployeeAdvances(employeeId!),

    enabled: !!employeeId,
  });
}

// ======================================
// Create Advance
// ======================================

export function useCreateAdvance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdvancePayload) => createAdvance(payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: advanceKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: advanceKeys.employee(variables.employee),
      });
    },
  });
}

// ======================================
// Update Advance
// ======================================

export function useUpdateAdvance(employeeId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      advanceId,
      data,
    }: {
      advanceId: string;
      data: UpdateAdvancePayload;
    }) => updateAdvance(advanceId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: advanceKeys.lists(),
      });

      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: advanceKeys.employee(employeeId),
        });
      }
    },
  });
}

// ======================================
// Cancel Advance
// ======================================

export function useCancelAdvance(employeeId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (advanceId: string) => cancelAdvance(advanceId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: advanceKeys.lists(),
      });

      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: advanceKeys.employee(employeeId),
        });
      }
    },
  });
}
