export type AdvanceStatus =
  | "active"
  | "partially_deducted"
  | "fully_deducted"
  | "cancelled";

export interface AdvanceFilters {
  employee?: string;
  status?: AdvanceStatus;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

export interface AdvanceEmployee {
  _id: string;
  empId: string;
  name: string;
  fatherName: string;
  designation: string;
  status: "active" | "inactive";
}

export interface AdvanceUser {
  _id: string;
  name: string;
  userId: string;
}

export interface Advance {
  _id: string;
  employee: string | AdvanceEmployee;
  amount: number;
  remainingAmount: number;
  advanceDate: string;
  description: string;
  status: AdvanceStatus;
  createdBy: string | AdvanceUser;
  updatedBy?: string | AdvanceUser | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdvancePayload {
  employee: string;
  amount: number;
  advanceDate?: string;
  description?: string;
}

export interface UpdateAdvancePayload {
  amount?: number;
  advanceDate?: string;
  description?: string;
}

export interface AdvanceResponse {
  success: boolean;
  message: string;
  data: Advance;
}

export interface AdvancesResponse {
  success: boolean;
  count: number;
  data: Advance[];
}

export interface EmployeeAdvancesResponse {
  success: boolean;
  count: number;
  data: {
    employee: AdvanceEmployee;
    advances: Advance[];
  };
}
