export type DeductionStatus =
  | "pending"
  | "partially_deducted"
  | "fully_deducted"
  | "cancelled";

export type EmployeeStatus = "active" | "inactive";

// ============================================================
// Employee
// ============================================================

export interface DeductionEmployee {
  _id: string;
  empId: string;
  name: string;
  fatherName: string;
  designation: string;
  status: EmployeeStatus;
}

// ============================================================
// User
// ============================================================

export interface DeductionUser {
  _id: string;
  name: string;
  userId: string;
}

// ============================================================
// Deduction
// ============================================================

export interface Deduction {
  _id: string;

  employee: string | DeductionEmployee;

  amount: number;
  remainingAmount: number;

  deductionDate: string;

  reason: string;

  status: DeductionStatus;

  createdBy: string | DeductionUser;

  updatedBy?: string | DeductionUser | null;

  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Create
// ============================================================

export interface CreateDeductionPayload {
  employee: string;
  amount: number;
  deductionDate?: string;
  reason: string;
}

// ============================================================
// Update
// ============================================================

export interface UpdateDeductionPayload {
  amount?: number;
  deductionDate?: string;
  reason?: string;
}

// ============================================================
// Filters
// ============================================================

export interface DeductionFilters {
  employee?: string;
  status?: DeductionStatus;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

// ============================================================
// API Responses
// ============================================================

export interface DeductionResponse {
  success: boolean;
  message: string;
  data: Deduction;
}

export interface DeductionsResponse {
  success: boolean;
  count: number;
  data: Deduction[];
}

export interface EmployeeDeductionsResponse {
  success: boolean;
  count: number;
  data: {
    employee: DeductionEmployee;
    deductions: Deduction[];
  };
}
