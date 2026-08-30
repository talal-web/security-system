// types/employeeSalary.ts

export type SalaryChangeReason =
  | "initial_salary"
  | "salary_increase"
  | "salary_decrease"
  | "promotion"
  | "designation_change"
  | "other";

export interface SalaryUser {
  _id: string;
  name: string;
  userId: string;
}

export interface SalaryEmployee {
  _id: string;
  empId: string;
  name: string;
  fatherName: string;
  designation: string;
  status: "active" | "inactive";
}

export interface EmployeeSalary {
  _id: string;
  employee: string | SalaryEmployee;
  monthlySalary: number;
  effectiveFrom: string;
  reason: SalaryChangeReason;
  notes?: string;
  createdBy: string | SalaryUser;
  updatedBy?: string | SalaryUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeSalaryPayload {
  employee: string;
  monthlySalary: number;
  effectiveFrom: string;
  reason?: SalaryChangeReason;
  notes?: string;
}

export interface UpdateEmployeeSalaryPayload {
  monthlySalary?: number;
  effectiveFrom?: string;
  reason?: SalaryChangeReason;
  notes?: string;
}

export interface CurrentEmployeeSalaryResponse {
  success: boolean;
  data: {
    employee: SalaryEmployee;
    salary: EmployeeSalary;
  };
  message?: string;
}

export interface EmployeeSalaryHistoryResponse {
  success: boolean;
  count: number;
  data: {
    employee: SalaryEmployee;
    salaryHistory: EmployeeSalary[];
  };
  message?: string;
}

export interface EmployeeSalaryResponse {
  success: boolean;
  message: string;
  data: EmployeeSalary;
}
