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
  areaId: string,
): Promise<AdvanceResponse> {
  try {
    const res = await api.post("/advances", { ...advanceData, area: areaId });

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
      params: {
        employee: filters?.employee || undefined,
        status: filters?.status || undefined,
        fromDate: filters?.fromDate || undefined,
        toDate: filters?.toDate || undefined,
        search: filters?.search || undefined,
        area: filters?.area || undefined,
      },
    });

    return res.data;
  } catch (error) {
    throw toAdvanceApiError(error);
  }
}

export async function getEmployeeAdvances(
  employeeId: string,
  areaId: string,
): Promise<EmployeeAdvancesResponse> {
  try {
    const res = await api.get(`/advances/employee/${employeeId}`, {
      params: { area: areaId },
    });

    return res.data;
  } catch (error) {
    throw toAdvanceApiError(error);
  }
}

export async function updateAdvance(
  advanceId: string,
  advanceData: UpdateAdvancePayload,
  areaId: string,
): Promise<AdvanceResponse> {
  try {
    const res = await api.patch(`/advances/${advanceId}`, {
      ...advanceData,
      area: areaId,
    });

    return res.data;
  } catch (error) {
    throw toAdvanceApiError(error);
  }
}

export async function cancelAdvance(
  advanceId: string,
  areaId: string,
): Promise<AdvanceResponse> {
  try {
    const res = await api.patch(`/advances/${advanceId}/cancel`, null, {
      params: { area: areaId },
    });

    return res.data;
  } catch (error) {
    throw toAdvanceApiError(error);
  }
}
