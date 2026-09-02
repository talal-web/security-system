export type BonusStatus = "pending" | "paid" | "cancelled";

export interface BonusEmployee {
  _id: string;
  empId: string;
  name: string;
  fatherName: string;
  designation: string;
  status: "active" | "inactive";
}

export interface BonusUser {
  _id: string;
  name: string;
  userId: string;
}

export interface Bonus {
  _id: string;
  employee: string | BonusEmployee;
  amount: number;
  bonusDate: string;
  reason: string;
  status: BonusStatus;
  createdBy: string | BonusUser;
  updatedBy?: string | BonusUser | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBonusPayload {
  employee: string;
  amount: number;
  bonusDate?: string;
  reason: string;
}

export interface UpdateBonusPayload {
  amount?: number;
  bonusDate?: string;
  reason?: string;
}

// ============================================================
// Filters
// ============================================================

export interface BonusFilters {
  employee?: string;
  status?: BonusStatus;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

// ============================================================
// API Responses
// ============================================================

export interface BonusResponse {
  success: boolean;
  message: string;
  data: Bonus;
}

export interface BonusesResponse {
  success: boolean;
  count: number;
  data: Bonus[];
}

export interface EmployeeBonusesResponse {
  success: boolean;
  count: number;
  data: {
    employee: BonusEmployee;
    bonuses: Bonus[];
  };
}
