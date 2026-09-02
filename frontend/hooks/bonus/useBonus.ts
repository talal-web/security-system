import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

  lists: () => [...bonusKeys.all, "list"] as const,

  list: (filters: BonusFilters = {}) =>
    [...bonusKeys.lists(), filters] as const,

  employee: (employeeId: string) =>
    [...bonusKeys.all, "employee", employeeId] as const,
};

// ============================================================
// Get All Bonuses
// ============================================================

export function useBonuses(filters: BonusFilters = {}) {
  return useQuery({
    queryKey: bonusKeys.list(filters),

    queryFn: () => getBonuses(filters),
  });
}

// ============================================================
// Get Employee Bonuses
// ============================================================

export function useEmployeeBonuses(employeeId?: string) {
  return useQuery({
    queryKey: employeeId
      ? bonusKeys.employee(employeeId)
      : [...bonusKeys.all, "employee", "disabled"],

    queryFn: () => getEmployeeBonuses(employeeId!),

    enabled: Boolean(employeeId),
  });
}

// ============================================================
// Create Bonus
// ============================================================

export function useCreateBonus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBonusPayload) => createBonus(payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: bonusKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: bonusKeys.employee(variables.employee),
      });
    },
  });
}

// ============================================================
// Update Bonus
// ============================================================

export function useUpdateBonus(employeeId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bonusId,
      data,
    }: {
      bonusId: string;
      data: UpdateBonusPayload;
    }) => updateBonus(bonusId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bonusKeys.lists(),
      });

      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: bonusKeys.employee(employeeId),
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

  return useMutation({
    mutationFn: (bonusId: string) => cancelBonus(bonusId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bonusKeys.lists(),
      });

      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: bonusKeys.employee(employeeId),
        });
      }
    },
  });
}
