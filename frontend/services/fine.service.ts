import api from "@/lib/axios";
import {
  CreateFinePayload,
  EmployeeFinesResponse,
  FineFilters,
  FineResponse,
  FinesResponse,
  UpdateFinePayload,
} from "@/types/fine";
import { getApiErrorMessage } from "@/lib/apiError";

export async function createFine(
  fineData: CreateFinePayload,
  areaId: string,
): Promise<FineResponse> {
  try {
    const res = await api.post("/fines", { ...fineData, area: areaId });

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

export async function getFines(filters?: FineFilters): Promise<FinesResponse> {
  try {
    const res = await api.get("/fines", {
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
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

export async function getEmployeeFines(
  employeeId: string,
  areaId: string,
): Promise<EmployeeFinesResponse> {
  try {
    const res = await api.get(`/fines/employee/${employeeId}`, {
      params: { area: areaId },
    });

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

export async function updateFine(
  fineId: string,
  fineData: UpdateFinePayload,
  areaId: string,
): Promise<FineResponse> {
  try {
    const res = await api.patch(`/fines/${fineId}`, {
      ...fineData,
      area: areaId,
    });

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

export async function cancelFine(
  fineId: string,
  areaId: string,
): Promise<FineResponse> {
  try {
    const res = await api.patch(`/fines/${fineId}/cancel`, null, {
      params: { area: areaId },
    });

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}
