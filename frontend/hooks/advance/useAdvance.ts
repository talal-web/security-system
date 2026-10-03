import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";

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

  area: (areaId: string) => [...advanceKeys.all, areaId] as const,

  lists: (areaId: string) => [...advanceKeys.area(areaId), "list"] as const,

  list: (areaId: string, filters?: AdvanceFilters) =>
    [...advanceKeys.lists(areaId), filters ?? {}] as const,

  employee: (areaId: string, employeeId: string) =>
    [...advanceKeys.area(areaId), "employee", employeeId] as const,
};

// ======================================
// Get All Advances
// ======================================

export function useAdvances(filters?: AdvanceFilters) {
  const { selectedAreaId } = useSelectedArea();
  const effectiveFilters = {
    ...filters,
    area: selectedAreaId ?? undefined,
  };

  return useQuery({
    queryKey: selectedAreaId
      ? advanceKeys.list(selectedAreaId, effectiveFilters)
      : [...advanceKeys.all, "disabled", "list"],
    queryFn: () => getAdvances(effectiveFilters),
    enabled: !!selectedAreaId,
  });
}

// ======================================
// Get Employee Advances
// ======================================

export function useEmployeeAdvances(employeeId?: string) {
  const { selectedAreaId } = useSelectedArea();

  return useQuery({
    queryKey:
      employeeId && selectedAreaId
        ? advanceKeys.employee(selectedAreaId, employeeId)
        : [...advanceKeys.all, "employee", "disabled"],

    queryFn: () => getEmployeeAdvances(employeeId!, selectedAreaId!),

    enabled: !!employeeId && !!selectedAreaId,
  });
}

// ======================================
// Create Advance
// ======================================

export function useCreateAdvance() {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (payload: CreateAdvancePayload) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return createAdvance(payload, selectedAreaId);
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: advanceKeys.lists(selectedAreaId!),
      });

      queryClient.invalidateQueries({
        queryKey: advanceKeys.employee(selectedAreaId!, variables.employee),
      });
    },
  });
}

// ======================================
// Update Advance
// ======================================

export function useUpdateAdvance(employeeId?: string) {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: ({
      advanceId,
      data,
    }: {
      advanceId: string;
      data: UpdateAdvancePayload;
    }) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return updateAdvance(advanceId, data, selectedAreaId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: advanceKeys.lists(selectedAreaId!),
      });

      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: advanceKeys.employee(selectedAreaId!, employeeId),
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
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (advanceId: string) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return cancelAdvance(advanceId, selectedAreaId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: advanceKeys.lists(selectedAreaId!),
      });

      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: advanceKeys.employee(selectedAreaId!, employeeId),
        });
      }
    },
  });
}
