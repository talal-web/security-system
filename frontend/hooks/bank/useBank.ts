import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createBankEntry,
  deleteBankEntry,
  getBankAccount,
  getBankMonth,
  getBankYear,
  updateBankAccount,
  updateBankEntry,
} from "@/services/bank.service";

import type {
  CreateBankEntryPayload,
  UpdateBankAccountPayload,
  UpdateBankEntryPayload,
} from "@/types/bank";

// ============================================================
// Query Keys
// ============================================================

export const bankKeys = {
  all: ["bank"] as const,
  account: () => [...bankKeys.all, "account"] as const,
  month: (year: number, month: number) =>
    [...bankKeys.all, "month", year, month] as const,
  year: (year: number) => [...bankKeys.all, "year", year] as const,
};

// ============================================================
// Queries
// ============================================================

export function useBankAccount() {
  return useQuery({
    queryKey: bankKeys.account(),
    queryFn: async () => (await getBankAccount()).data,
  });
}

export function useBankMonth(year: number, month: number) {
  return useQuery({
    queryKey: bankKeys.month(year, month),
    queryFn: async () => (await getBankMonth(year, month)).data,
  });
}

export function useBankYear(year: number) {
  return useQuery({
    queryKey: bankKeys.year(year),
    queryFn: async () => (await getBankYear(year)).data,
  });
}

// ============================================================
// Mutations
// ============================================================

// Any change to an entry or the account changes balances in every later
// month, so all bank queries are refreshed together.
function useInvalidateBank() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: bankKeys.all });
}

export function useCreateBankEntry() {
  const invalidate = useInvalidateBank();

  return useMutation({
    mutationFn: (payload: CreateBankEntryPayload) => createBankEntry(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateBankEntry() {
  const invalidate = useInvalidateBank();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBankEntryPayload }) =>
      updateBankEntry(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteBankEntry() {
  const invalidate = useInvalidateBank();

  return useMutation({
    mutationFn: (id: string) => deleteBankEntry(id),
    onSuccess: invalidate,
  });
}

export function useUpdateBankAccount() {
  const invalidate = useInvalidateBank();

  return useMutation({
    mutationFn: (payload: UpdateBankAccountPayload) => updateBankAccount(payload),
    onSuccess: invalidate,
  });
}
