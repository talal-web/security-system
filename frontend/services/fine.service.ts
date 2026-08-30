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
): Promise<FineResponse> {
  try {
    const res = await api.post("/fines", fineData);

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

export async function getFines(filters?: FineFilters): Promise<FinesResponse> {
  try {
    const res = await api.get("/fines", {
      params: filters,
    });

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

export async function getEmployeeFines(
  employeeId: string,
): Promise<EmployeeFinesResponse> {
  try {
    const res = await api.get(`/fines/employee/${employeeId}`);

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

export async function updateFine(
  fineId: string,
  fineData: UpdateFinePayload,
): Promise<FineResponse> {
  try {
    const res = await api.patch(`/fines/${fineId}`, fineData);

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

export async function cancelFine(fineId: string): Promise<FineResponse> {
  try {
    const res = await api.patch(`/fines/${fineId}/cancel`);

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}
