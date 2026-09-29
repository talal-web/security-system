import type { UserRole } from "./user";

export interface User {
  id: string;
  _id?: string;
  name: string;
  role: UserRole;
  userId: string;
  areas?: string[];
}

export interface LoginPayload {
  userId: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}
// types/auth.ts

export type MeResponse = {
  user: User;
};
