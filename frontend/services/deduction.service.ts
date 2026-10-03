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
  areaId: string,
): Promise<DeductionResponse> {
  try {
    const res = await api.post("/deductions", {
      ...deductionData,
      area: areaId,
    });

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
        area: filters.area || undefined,
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
  areaId: string,
): Promise<EmployeeDeductionsResponse> {
  try {
    const res = await api.get(`/deductions/employee/${employeeId}`, {
      params: { area: areaId },
    });

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
  areaId: string,
): Promise<DeductionResponse> {
  try {
    const res = await api.patch(`/deductions/${deductionId}`, {
      ...deductionData,
      area: areaId,
    });

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
  areaId: string,
): Promise<DeductionResponse> {
  try {
    const res = await api.patch(`/deductions/${deductionId}/cancel`, null, {
      params: { area: areaId },
    });

    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
