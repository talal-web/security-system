export type UserRole = "developer" | "admin" | "clerk" | "supervisor";

export interface User {
  _id: string;
  userId: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  userId: string;
  name: string;
  password: string;
  role: UserRole;
  isActive?: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface ChangeUserPasswordPayload {
  password: string;
}

export interface UpdateUserStatusPayload {
  isActive: boolean;
}

export interface UsersResponse {
  count: number;
  users: User[];
}

export interface UserResponse {
  user: User;
}

export interface ApiMessageResponse {
  message: string;
}
