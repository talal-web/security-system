import api from "@/lib/axios";

import {
  CreateDeductionPayload,
  DeductionFilters,
  DeductionResponse,
  DeductionsResponse,
  EmployeeDeductionsResponse,
  UpdateDeductionPayload,
} from "@/types/deduction";

import { getApiErrorMessage } from "@/lib/apiError";

// ============================================================
// Create Deduction
// ============================================================

export async function createDeduction(
  deductionData: CreateDeductionPayload,
): Promise<DeductionResponse> {
  try {
    const res = await api.post("/deductions", deductionData);

    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

// ============================================================
// Get Deductions
// ============================================================

export async function getDeductions(
  filters: DeductionFilters = {},
): Promise<DeductionsResponse> {
  try {
    const res = await api.get("/deductions", {
      params: {
        employee: filters.employee || undefined,
        status: filters.status || undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        search: filters.search?.trim() || undefined,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

// ============================================================
// Get Employee Deductions
// ============================================================

export async function getEmployeeDeductions(
  employeeId: string,
): Promise<EmployeeDeductionsResponse> {
  try {
    const res = await api.get(`/deductions/employee/${employeeId}`);

    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

// ============================================================
// Update Deduction
// ============================================================

export async function updateDeduction(
  deductionId: string,
  deductionData: UpdateDeductionPayload,
): Promise<DeductionResponse> {
  try {
    const res = await api.patch(`/deductions/${deductionId}`, deductionData);

    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

// ============================================================
// Cancel Deduction
// ============================================================

export async function cancelDeduction(
  deductionId: string,
): Promise<DeductionResponse> {
  try {
    const res = await api.patch(`/deductions/${deductionId}/cancel`);

    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
