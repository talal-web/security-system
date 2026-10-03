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
  areaId: string,
): Promise<PayrollResponse> {
  try {
    const res = await api.get(`/payroll/${payrollId}`, {
      params: { area: areaId },
    });

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
  areaId: string,
): Promise<PayrollListResponse> {
  try {
    const res = await api.get(`/payroll/employee/${employeeId}`, {
      params: { area: areaId },
    });

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
  areaId: string,
): Promise<PayrollResponse> {
  try {
    const res = await api.post("/payroll/generate", {
      ...payrollData,
      area: areaId,
    });

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
  areaId: string,
): Promise<GenerateMonthlyPayrollResponse> {
  try {
    const res = await api.post("/payroll/generate-month", {
      ...payrollData,
      area: areaId,
    });

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
  areaId: string,
): Promise<PayrollResponse> {
  try {
    const res = await api.post(`/payroll/${payrollId}/recalculate`, {
      area: areaId,
    });

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
  areaId: string,
): Promise<RecalculateMonthlyPayrollResponse> {
  try {
    const res = await api.post("/payroll/recalculate-month", {
      ...payrollData,
      area: areaId,
    });

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
  areaId: string,
): Promise<PayrollResponse> {
  try {
    const res = await api.patch(`/payroll/${payrollId}/finalize`, {
      area: areaId,
    });

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
  areaId: string,
): Promise<PayrollResponse> {
  try {
    const res = await api.patch(`/payroll/${payrollId}/pay`, {
      ...paymentData,
      area: areaId,
    });

    return res.data;
  } catch (error) {
    throw toPayrollApiError(error);
  }
}
