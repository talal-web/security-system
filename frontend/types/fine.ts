export type FineStatus =
  | "pending"
  | "partially_deducted"
  | "fully_deducted"
  | "cancelled";

export interface FineEmployee {
  _id: string;
  empId: string;
  name: string;
  fatherName: string;
  designation: string;
  status: "active" | "inactive";
}

export interface FineUser {
  _id: string;
  name: string;
  userId: string;
}

export interface Fine {
  _id: string;

  employee: string | FineEmployee;

  amount: number;
  remainingAmount: number;

  fineDate: string;

  reason: string;

  status: FineStatus;

  createdBy: string | FineUser;
  updatedBy?: string | FineUser | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateFinePayload {
  employee: string;
  amount: number;
  fineDate?: string;
  reason: string;
}

export interface UpdateFinePayload {
  amount?: number;
  fineDate?: string;
  reason?: string;
}

/* ================================================================
   FINE FILTERS
   ================================================================ */

export interface FineFilters {
  employee?: string;
  status?: FineStatus;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

/* ================================================================
   RESPONSES
   ================================================================ */

export interface FineResponse {
  success: boolean;
  message: string;
  data: Fine;
}

export interface FinesResponse {
  success: boolean;
  count: number;
  data: Fine[];
}

export interface EmployeeFinesResponse {
  success: boolean;
  count: number;
  data: {
    employee: FineEmployee;
    fines: Fine[];
  };
}
