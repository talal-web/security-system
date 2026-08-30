import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  cancelFine,
  createFine,
  getEmployeeFines,
  getFines,
  updateFine,
} from "@/services/fine.service";

import type {
  CreateFinePayload,
  FineFilters,
  UpdateFinePayload,
} from "@/types/fine";

// ======================================
// Query Keys
// ======================================

export const fineKeys = {
  all: ["fines"] as const,

  lists: () => [...fineKeys.all, "list"] as const,

  list: (filters?: FineFilters) =>
    [...fineKeys.lists(), filters ?? {}] as const,

  employee: (employeeId: string) =>
    [...fineKeys.all, "employee", employeeId] as const,
};

// ======================================
// Get All Fines
// ======================================

export function useFines(filters?: FineFilters) {
  return useQuery({
    queryKey: fineKeys.list(filters),
    queryFn: () => getFines(filters),
  });
}

// ======================================
// Get Employee Fines
// ======================================

export function useEmployeeFines(employeeId?: string) {
  return useQuery({
    queryKey: employeeId
      ? fineKeys.employee(employeeId)
      : [...fineKeys.all, "employee", "disabled"],

    queryFn: () => getEmployeeFines(employeeId!),

    enabled: !!employeeId,
  });
}

// ======================================
// Create Fine
// ======================================

export function useCreateFine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFinePayload) => createFine(payload),

    onSuccess: (_data, variables) => {
      // Invalidate all filtered fine lists
      queryClient.invalidateQueries({
        queryKey: fineKeys.lists(),
      });

      // Invalidate employee-specific fine history
      queryClient.invalidateQueries({
        queryKey: fineKeys.employee(variables.employee),
      });
    },
  });
}

// ======================================
// Update Fine
// ======================================

export function useUpdateFine(employeeId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fineId,
      data,
    }: {
      fineId: string;
      data: UpdateFinePayload;
    }) => updateFine(fineId, data),

    onSuccess: () => {
      // Invalidate all filtered fine lists
      queryClient.invalidateQueries({
        queryKey: fineKeys.lists(),
      });

      // Invalidate employee-specific fine history
      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: fineKeys.employee(employeeId),
        });
      }
    },
  });
}

// ======================================
// Cancel Fine
// ======================================

export function useCancelFine(employeeId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fineId: string) => cancelFine(fineId),

    onSuccess: () => {
      // Invalidate all filtered fine lists
      queryClient.invalidateQueries({
        queryKey: fineKeys.lists(),
      });

      // Invalidate employee-specific fine history
      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: fineKeys.employee(employeeId),
        });
      }
    },
  });
}
