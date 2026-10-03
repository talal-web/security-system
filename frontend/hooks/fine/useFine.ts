import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";

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

  area: (areaId: string) => [...fineKeys.all, areaId] as const,

  lists: (areaId: string) => [...fineKeys.area(areaId), "list"] as const,

  list: (areaId: string, filters?: FineFilters) =>
    [...fineKeys.lists(areaId), filters ?? {}] as const,

  employee: (areaId: string, employeeId: string) =>
    [...fineKeys.area(areaId), "employee", employeeId] as const,
};

// ======================================
// Get All Fines
// ======================================

export function useFines(filters?: FineFilters) {
  const { selectedAreaId } = useSelectedArea();
  const effectiveFilters = {
    ...filters,
    area: selectedAreaId ?? undefined,
  };

  return useQuery({
    queryKey: selectedAreaId
      ? fineKeys.list(selectedAreaId, effectiveFilters)
      : [...fineKeys.all, "disabled", "list"],
    queryFn: () => getFines(effectiveFilters),
    enabled: !!selectedAreaId,
  });
}

// ======================================
// Get Employee Fines
// ======================================

export function useEmployeeFines(employeeId?: string) {
  const { selectedAreaId } = useSelectedArea();

  return useQuery({
    queryKey:
      employeeId && selectedAreaId
        ? fineKeys.employee(selectedAreaId, employeeId)
        : [...fineKeys.all, "employee", "disabled"],

    queryFn: () => getEmployeeFines(employeeId!, selectedAreaId!),

    enabled: !!employeeId && !!selectedAreaId,
  });
}

// ======================================
// Create Fine
// ======================================

export function useCreateFine() {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (payload: CreateFinePayload) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return createFine(payload, selectedAreaId);
    },

    onSuccess: (_data, variables) => {
      // Invalidate all filtered fine lists
      queryClient.invalidateQueries({
        queryKey: fineKeys.lists(selectedAreaId!),
      });

      // Invalidate employee-specific fine history
      queryClient.invalidateQueries({
        queryKey: fineKeys.employee(selectedAreaId!, variables.employee),
      });
    },
  });
}

// ======================================
// Update Fine
// ======================================

export function useUpdateFine(employeeId?: string) {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: ({
      fineId,
      data,
    }: {
      fineId: string;
      data: UpdateFinePayload;
    }) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return updateFine(fineId, data, selectedAreaId);
    },

    onSuccess: () => {
      // Invalidate all filtered fine lists
      queryClient.invalidateQueries({
        queryKey: fineKeys.lists(selectedAreaId!),
      });

      // Invalidate employee-specific fine history
      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: fineKeys.employee(selectedAreaId!, employeeId),
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
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (fineId: string) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return cancelFine(fineId, selectedAreaId);
    },

    onSuccess: () => {
      // Invalidate all filtered fine lists
      queryClient.invalidateQueries({
        queryKey: fineKeys.lists(selectedAreaId!),
      });

      // Invalidate employee-specific fine history
      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: fineKeys.employee(selectedAreaId!, employeeId),
        });
      }
    },
  });
}
