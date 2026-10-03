import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";

import {
  cancelBonus,
  createBonus,
  getBonuses,
  getEmployeeBonuses,
  updateBonus,
} from "@/services/bonus.service";

import type {
  BonusFilters,
  CreateBonusPayload,
  UpdateBonusPayload,
} from "@/types/bonus";

// ============================================================
// Query Keys
// ============================================================

export const bonusKeys = {
  all: ["bonuses"] as const,

  area: (areaId: string) => [...bonusKeys.all, areaId] as const,

  lists: (areaId: string) => [...bonusKeys.area(areaId), "list"] as const,

  list: (areaId: string, filters: BonusFilters = {}) =>
    [...bonusKeys.lists(areaId), filters] as const,

  employee: (areaId: string, employeeId: string) =>
    [...bonusKeys.area(areaId), "employee", employeeId] as const,
};

// ============================================================
// Get All Bonuses
// ============================================================

export function useBonuses(filters: BonusFilters = {}) {
  const { selectedAreaId } = useSelectedArea();
  const effectiveFilters = {
    ...filters,
    area: selectedAreaId ?? undefined,
  };

  return useQuery({
    queryKey: selectedAreaId
      ? bonusKeys.list(selectedAreaId, effectiveFilters)
      : [...bonusKeys.all, "disabled", "list"],

    queryFn: () => getBonuses(effectiveFilters),
    enabled: !!selectedAreaId,
  });
}

// ============================================================
// Get Employee Bonuses
// ============================================================

export function useEmployeeBonuses(employeeId?: string) {
  const { selectedAreaId } = useSelectedArea();

  return useQuery({
    queryKey:
      employeeId && selectedAreaId
        ? bonusKeys.employee(selectedAreaId, employeeId)
        : [...bonusKeys.all, "employee", "disabled"],

    queryFn: () => getEmployeeBonuses(employeeId!, selectedAreaId!),

    enabled: Boolean(employeeId) && !!selectedAreaId,
  });
}

// ============================================================
// Create Bonus
// ============================================================

export function useCreateBonus() {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (payload: CreateBonusPayload) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return createBonus(payload, selectedAreaId);
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: bonusKeys.lists(selectedAreaId!),
      });

      queryClient.invalidateQueries({
        queryKey: bonusKeys.employee(selectedAreaId!, variables.employee),
      });
    },
  });
}

// ============================================================
// Update Bonus
// ============================================================

export function useUpdateBonus(employeeId?: string) {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: ({
      bonusId,
      data,
    }: {
      bonusId: string;
      data: UpdateBonusPayload;
    }) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return updateBonus(bonusId, data, selectedAreaId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bonusKeys.lists(selectedAreaId!),
      });

      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: bonusKeys.employee(selectedAreaId!, employeeId),
        });
      }
    },
  });
}

// ============================================================
// Cancel Bonus
// ============================================================

export function useCancelBonus(employeeId?: string) {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (bonusId: string) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return cancelBonus(bonusId, selectedAreaId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bonusKeys.lists(selectedAreaId!),
      });

      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: bonusKeys.employee(selectedAreaId!, employeeId),
        });
      }
    },
  });
}
