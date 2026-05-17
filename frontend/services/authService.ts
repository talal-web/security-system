import api from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/apiError";
import type { LoginPayload, LoginResponse } from "@/types/user";
import type { MeResponse } from "@/types/user";

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const res = await api.post("/auth/login", payload);

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
    throw new Error(message);
  }
}
