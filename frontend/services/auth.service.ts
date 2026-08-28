import api from "@/lib/axios";
import {
  ApiError,
  getApiErrorMessage,
  getApiErrorStatus,
} from "@/lib/apiError";
import type { LoginPayload, LoginResponse } from "@/types/authentication";
import type { MeResponse } from "@/types/authentication";

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const res = await api.post("/auth/login", payload);

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);
    throw new Error(message);
  }
}

export async function logoutUser(): Promise<{ message: string }> {
  try {
    const res = await api.post("/auth/logout");

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);
    throw new Error(message);
  }
}

export async function getMe(): Promise<MeResponse> {
  try {
    const res = await api.get("/auth/me");

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);
    const status = getApiErrorStatus(error);
    throw new ApiError(message, status);
  }
}
