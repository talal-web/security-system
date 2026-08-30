import api from "@/lib/axios";
import {
  AdvanceFilters,
  AdvanceResponse,
  AdvancesResponse,
  CreateAdvancePayload,
  EmployeeAdvancesResponse,
  UpdateAdvancePayload,
} from "@/types/advance";
import {
  ApiError,
  getApiErrorMessage,
  getApiErrorStatus,
} from "@/lib/apiError";

function toAdvanceApiError(error: unknown): ApiError {
  return new ApiError(getApiErrorMessage(error), getApiErrorStatus(error));
}

export async function createAdvance(
  advanceData: CreateAdvancePayload,
): Promise<AdvanceResponse> {
  try {
    const res = await api.post("/advances", advanceData);

    return res.data;
  } catch (error) {
    throw toAdvanceApiError(error);
  }
}

export async function getAdvances(
  filters?: AdvanceFilters,
): Promise<AdvancesResponse> {
  try {
    const res = await api.get("/advances", {
      params: filters,
    });

    return res.data;
  } catch (error) {
    throw toAdvanceApiError(error);
  }
}

export async function getEmployeeAdvances(
  employeeId: string,
): Promise<EmployeeAdvancesResponse> {
  try {
    const res = await api.get(`/advances/employee/${employeeId}`);

    return res.data;
  } catch (error) {
    throw toAdvanceApiError(error);
  }
}

export async function updateAdvance(
  advanceId: string,
  advanceData: UpdateAdvancePayload,
): Promise<AdvanceResponse> {
  try {
    const res = await api.patch(`/advances/${advanceId}`, advanceData);

    return res.data;
  } catch (error) {
    throw toAdvanceApiError(error);
  }
}

export async function cancelAdvance(
  advanceId: string,
): Promise<AdvanceResponse> {
  try {
    const res = await api.patch(`/advances/${advanceId}/cancel`);

    return res.data;
  } catch (error) {
    throw toAdvanceApiError(error);
  }
}
