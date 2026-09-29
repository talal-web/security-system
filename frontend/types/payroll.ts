// frontend/types/payroll.ts

// ============================================================================
// PAYROLL STATUS
// ============================================================================

export type PayrollStatus = "draft" | "finalized" | "paid";

// ============================================================================
// PAYMENT METHOD
// ============================================================================

export type PayrollPaymentMethod = "cash" | "bank_transfer" | "other";

// ============================================================================
// EMPLOYEE
// ============================================================================

export interface PayrollEmployee {
  _id: string;
  empId: string;
  name: string;
  fatherName?: string;
  designation?: string;
  status?: string;
  entryDate?: string;
  exitDate?: string | null;
}

// ============================================================================
// USER
// ============================================================================

export interface PayrollUser {
  _id?: string;
  userId?: string;
  name?: string;
  role?: string;
}

// ============================================================================
// PAYROLL SOURCE ITEM
// ============================================================================

export interface PayrollItem {
  source: string;
  amount: number;
}

// ============================================================================
// PAYROLL
// ============================================================================

export interface Payroll {
  _id: string;

  employee: string | PayrollEmployee;

  year: number;
  month: number;

  periodStart: string;
  periodEnd: string;

  // Salary snapshot
  monthlySalary: number;
  salaryEffectiveFrom: string;
  calendarDays: number;
  payableDays: number;
  salaryPerDay: number;

  // Attendance snapshot
  presentDays: number;
  leaveDays: number;
  absentDays: number;
  missingDays: number;

  // Earnings
  earnedSalary: number;
  bonuses: PayrollItem[];
  totalBonus: number;
  grossSalary: number;

  // Deductions
  advanceDeductions: PayrollItem[];
  fineDeductions: PayrollItem[];
  otherDeductions: PayrollItem[];

  totalAdvanceDeduction: number;
  totalFineDeduction: number;
  totalOtherDeduction: number;
  totalDeductions: number;

  netSalary: number;

  // Lifecycle
  status: PayrollStatus;

  generatedAt: string;

  finalizedAt: string | null;
  finalizedBy: string | PayrollUser | null;

  paidAt: string | null;
  paidBy: string | PayrollUser | null;

  paymentMethod: PayrollPaymentMethod | null;
  paymentReference: string;

  notes: string;

  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface PayrollResponse {
  success: boolean;
  message?: string;
  data: Payroll;
}

export interface PayrollListResponse {
  success: boolean;
  message?: string;
  count: number;
  data: Payroll[];
}

// ============================================================================
// GENERATE PAYROLL
// ============================================================================

export interface GeneratePayrollPayload {
  employeeId: string;
  year: number;
  month: number;
}

// ============================================================================
// GENERATE MONTHLY PAYROLL
// ============================================================================

export interface GenerateMonthlyPayrollPayload {
  year: number;
  month: number;
}

// ============================================================================
// GENERATE MONTHLY PAYROLL RESULT
// ============================================================================

export interface GenerateMonthlyPayrollResult {
  year: number;
  month: number;

  totalEmployees: number;
  generated: number;
  skipped: number;
  failed: number;

  payrollIds: string[];

  errors: PayrollGenerationError[];
}

export interface PayrollGenerationError {
  employeeId: string;
  empId?: string;
  name?: string;
  message: string;
}

// ============================================================================
// GENERATE MONTHLY PAYROLL RESPONSE
// ============================================================================

export interface GenerateMonthlyPayrollResponse {
  success: boolean;
  message?: string;
  data: GenerateMonthlyPayrollResult;
}

// ============================================================================
// RECALCULATE SINGLE PAYROLL
// ============================================================================

export interface RecalculatePayrollPayload {
  payrollId: string;
}

// ============================================================================
// RECALCULATE MONTHLY PAYROLL
// ============================================================================

export interface RecalculateMonthlyPayrollPayload {
  year: number;
  month: number;
}

// ============================================================================
// RECALCULATE MONTHLY PAYROLL ERROR
// ============================================================================

export interface PayrollRecalculationError {
  payrollId: string;
  employeeId: string;
  message: string;
}

// ============================================================================
// RECALCULATE MONTHLY PAYROLL RESULT
// ============================================================================

export interface RecalculateMonthlyPayrollResult {
  year: number;
  month: number;
  total: number;
  recalculated: number;
  failed: number;
  errors: PayrollRecalculationError[];
}

// ============================================================================
// RECALCULATE MONTHLY PAYROLL RESPONSE
// ============================================================================

export interface RecalculateMonthlyPayrollResponse {
  success: boolean;
  message?: string;
  data: RecalculateMonthlyPayrollResult;
}

// ============================================================================
// PAYROLL PAYMENT
// ============================================================================

export interface MarkPayrollPaidPayload {
  payrollId: string;
  paymentMethod: PayrollPaymentMethod;
  paymentReference: string;
}

// ============================================================================
// PAYROLL FILTERS
// ============================================================================

export type PayrollStatusFilter = "all" | PayrollStatus;

export interface PayrollFilters {
  year?: number;
  month?: number;
  employee?: string;
  status?: PayrollStatusFilter;
  search?: string;
  area?: string;
}
