import api from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/apiError";

import type {
  ApiMessageResponse,
  ChangeUserPasswordPayload,
  CreateUserPayload,
  UpdateUserPayload,
  UpdateUserStatusPayload,
  UserResponse,
  UsersResponse,
} from "@/types/user";

export async function createUser(
  payload: CreateUserPayload,
): Promise<UserResponse> {
  try {
    const res = await api.post("/users", payload);

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);
    throw new Error(message);
  }
}

export async function getUsers(): Promise<UsersResponse> {
  try {
    const res = await api.get("/users");

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);
    throw new Error(message);
  }
}

export async function getUserById(id: string): Promise<UserResponse> {
  try {
    const res = await api.get(`/users/${id}`);

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);
    throw new Error(message);
  }
}

export async function updateUser(
  id: string,
  payload: UpdateUserPayload,
): Promise<UserResponse> {
  try {
    const res = await api.patch(`/users/${id}`, payload);

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);
    throw new Error(message);
  }
}

export async function changeUserPassword(
  id: string,
  payload: ChangeUserPasswordPayload,
): Promise<ApiMessageResponse> {
  try {
    const res = await api.patch(`/users/${id}/password`, payload);

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);
    throw new Error(message);
  }
}

export async function updateUserStatus(
  id: string,
  payload: UpdateUserStatusPayload,
): Promise<UserResponse> {
  try {
    const res = await api.patch(`/users/${id}/status`, payload);

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);
    throw new Error(message);
  }
}

export async function deleteUser(id: string): Promise<ApiMessageResponse> {
  try {
    const res = await api.delete(`/users/${id}`);

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);
    throw new Error(message);
  }
}
