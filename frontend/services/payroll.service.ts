import api from "@/lib/axios";
import {
  GenerateMonthlyPayrollPayload,
  GenerateMonthlyPayrollResponse,
  GeneratePayrollPayload,
  PayrollFilters,
  PayrollListResponse,
  PayrollResponse,
  MarkPayrollPaidPayload,
  RecalculateMonthlyPayrollPayload,
  RecalculateMonthlyPayrollResponse,
} from "@/types/payroll";
import {
  ApiError,
  getApiErrorMessage,
  getApiErrorStatus,
} from "@/lib/apiError";

function toPayrollApiError(error: unknown): ApiError {
  return new ApiError(getApiErrorMessage(error), getApiErrorStatus(error));
}

// ============================================================================
// GET PAYROLLS
// ============================================================================

export async function getPayrolls(
  filters?: PayrollFilters,
): Promise<PayrollListResponse> {
  try {
    const { status, ...otherFilters } = filters ?? {};

    const res = await api.get("/payroll", {
      params: {
        ...otherFilters,
        ...(status && status !== "all" ? { status } : {}),
      },
    });

    return res.data;
  } catch (error) {
    throw toPayrollApiError(error);
  }
}

// ============================================================================
// GET PAYROLL BY ID
// ============================================================================

export async function getPayrollById(
  payrollId: string,
): Promise<PayrollResponse> {
  try {
    const res = await api.get(`/payroll/${payrollId}`);

    return res.data;
  } catch (error) {
    throw toPayrollApiError(error);
  }
}

// ============================================================================
// GET EMPLOYEE PAYROLLS
// ============================================================================

export async function getEmployeePayrolls(
  employeeId: string,
): Promise<PayrollListResponse> {
  try {
    const res = await api.get(`/payroll/employee/${employeeId}`);

    return res.data;
  } catch (error) {
    throw toPayrollApiError(error);
  }
}

// ============================================================================
// GENERATE SINGLE PAYROLL
// ============================================================================

export async function generatePayroll(
  payrollData: GeneratePayrollPayload,
): Promise<PayrollResponse> {
  try {
    const res = await api.post("/payroll/generate", payrollData);

    return res.data;
  } catch (error) {
    throw toPayrollApiError(error);
  }
}

// ============================================================================
// GENERATE MONTHLY PAYROLL
// ============================================================================

export async function generateMonthlyPayroll(
  payrollData: GenerateMonthlyPayrollPayload,
): Promise<GenerateMonthlyPayrollResponse> {
  try {
    const res = await api.post("/payroll/generate-month", payrollData);

    return res.data;
  } catch (error) {
    throw toPayrollApiError(error);
  }
}

// ============================================================================
// RECALCULATE SINGLE PAYROLL
// ============================================================================

export async function recalculatePayroll(
  payrollId: string,
): Promise<PayrollResponse> {
  try {
    const res = await api.post(`/payroll/${payrollId}/recalculate`);

    return res.data;
  } catch (error) {
    throw toPayrollApiError(error);
  }
}

// ============================================================================
// RECALCULATE ALL DRAFT PAYROLLS FOR MONTH
// ============================================================================

export async function recalculateMonthlyPayroll(
  payrollData: RecalculateMonthlyPayrollPayload,
): Promise<RecalculateMonthlyPayrollResponse> {
  try {
    const res = await api.post("/payroll/recalculate-month", payrollData);

    return res.data;
  } catch (error) {
    throw toPayrollApiError(error);
  }
}

// ============================================================================
// FINALIZE PAYROLL
// ============================================================================

export async function finalizePayroll(
  payrollId: string,
): Promise<PayrollResponse> {
  try {
    const res = await api.patch(`/payroll/${payrollId}/finalize`);

    return res.data;
  } catch (error) {
    throw toPayrollApiError(error);
  }
}

// ============================================================================
// MARK PAYROLL AS PAID
// ============================================================================

export async function markPayrollAsPaid(
  payrollId: string,
  paymentData: Omit<MarkPayrollPaidPayload, "payrollId">,
): Promise<PayrollResponse> {
  try {
    const res = await api.patch(`/payroll/${payrollId}/pay`, paymentData);

    return res.data;
  } catch (error) {
    throw toPayrollApiError(error);
  }
}
