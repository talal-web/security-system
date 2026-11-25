import api from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/apiError";

import type {
  BankAccountSummary,
  BankEntry,
  BankMonthReport,
  BankYearReport,
  CreateBankEntryPayload,
  UpdateBankAccountPayload,
  UpdateBankEntryPayload,
} from "@/types/bank";

async function request<T>(run: () => Promise<{ data: T }>): Promise<T> {
  try {
    const res = await run();
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export function getBankAccount() {
  return request<{ success: true; data: BankAccountSummary }>(() =>
    api.get("/bank/account"),
  );
}

export function updateBankAccount(payload: UpdateBankAccountPayload) {
  return request<{ success: true; data: unknown }>(() =>
    api.put("/bank/account", payload),
  );
}

export function getBankMonth(year: number, month: number) {
  return request<{ success: true; data: BankMonthReport }>(() =>
    api.get(`/bank/reports/months/${year}/${month}`),
  );
}

export function getBankYear(year: number) {
  return request<{ success: true; data: BankYearReport }>(() =>
    api.get(`/bank/reports/years/${year}`),
  );
}

export function createBankEntry(payload: CreateBankEntryPayload) {
  return request<{ success: true; data: BankEntry }>(() =>
    api.post("/bank/entries", payload),
  );
}

export function updateBankEntry(id: string, payload: UpdateBankEntryPayload) {
  return request<{ success: true; data: BankEntry }>(() =>
    api.patch(`/bank/entries/${id}`, payload),
  );
}

export function deleteBankEntry(id: string) {
  return request<{ success: true }>(() => api.delete(`/bank/entries/${id}`));
}
