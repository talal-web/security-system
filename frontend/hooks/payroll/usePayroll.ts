import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";
import {
  finalizePayroll,
  generateMonthlyPayroll,
  generatePayroll,
  getEmployeePayrolls,
  getPayrollById,
  getPayrolls,
  markPayrollAsPaid,
  recalculateMonthlyPayroll,
  recalculatePayroll,
} from "@/services/payroll.service";

import type {
  GenerateMonthlyPayrollPayload,
  GeneratePayrollPayload,
  MarkPayrollPaidPayload,
  PayrollFilters,
  RecalculateMonthlyPayrollPayload,
} from "@/types/payroll";

// ============================================================================
// QUERY KEYS
// ============================================================================

export const payrollKeys = {
  all: ["payroll"] as const,

  lists: () => [...payrollKeys.all, "list"] as const,

  list: (filters?: PayrollFilters) =>
    [...payrollKeys.lists(), filters] as const,

  details: () => [...payrollKeys.all, "detail"] as const,

  detail: (payrollId: string) => [...payrollKeys.details(), payrollId] as const,

  employee: (employeeId: string) =>
    [...payrollKeys.all, "employee", employeeId] as const,
};

// ============================================================================
// GET ALL PAYROLLS
// ============================================================================

export function usePayrolls(filters?: PayrollFilters) {
  const { selectedAreaId } = useSelectedArea();
  const effectiveFilters = {
    ...filters,
    ...(selectedAreaId && !filters?.area ? { area: selectedAreaId } : {}),
  };

  return useQuery({
    queryKey: payrollKeys.list(effectiveFilters),
    queryFn: () => getPayrolls(effectiveFilters),
  });
}

// ============================================================================
// GET SINGLE PAYROLL
// ============================================================================

export function usePayroll(payrollId: string) {
  return useQuery({
    queryKey: payrollKeys.detail(payrollId),
    queryFn: () => getPayrollById(payrollId),
    enabled: Boolean(payrollId),
  });
}

// ============================================================================
// GET EMPLOYEE PAYROLLS
// ============================================================================

export function useEmployeePayrolls(employeeId: string) {
  return useQuery({
    queryKey: payrollKeys.employee(employeeId),
    queryFn: () => getEmployeePayrolls(employeeId),
    enabled: Boolean(employeeId),
  });
}

// ============================================================================
// GENERATE SINGLE PAYROLL
// ============================================================================

export function useGeneratePayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payrollData: GeneratePayrollPayload) =>
      generatePayroll(payrollData),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.all,
      });

      const employee = response.data.employee;

      if (employee) {
        const employeeId =
          typeof employee === "string" ? employee : employee._id;

        queryClient.invalidateQueries({
          queryKey: payrollKeys.employee(employeeId),
        });
      }
    },
  });
}

// ============================================================================
// GENERATE MONTHLY PAYROLL
// ============================================================================

export function useGenerateMonthlyPayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payrollData: GenerateMonthlyPayrollPayload) =>
      generateMonthlyPayroll(payrollData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.all,
      });
    },
  });
}

// ============================================================================
// RECALCULATE SINGLE PAYROLL
// ============================================================================

export function useRecalculatePayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payrollId: string) => recalculatePayroll(payrollId),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: payrollKeys.detail(response.data._id),
      });

      const employee = response.data.employee;

      if (employee) {
        const employeeId =
          typeof employee === "string" ? employee : employee._id;

        queryClient.invalidateQueries({
          queryKey: payrollKeys.employee(employeeId),
        });
      }
    },
  });
}

// ============================================================================
// RECALCULATE ALL DRAFT PAYROLLS FOR MONTH
// ============================================================================

export function useRecalculateMonthlyPayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payrollData: RecalculateMonthlyPayrollPayload) =>
      recalculateMonthlyPayroll(payrollData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.all,
      });
    },
  });
}

// ============================================================================
// FINALIZE PAYROLL
// ============================================================================

export function useFinalizePayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payrollId: string) => finalizePayroll(payrollId),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: payrollKeys.detail(response.data._id),
      });

      const employee = response.data.employee;

      if (employee) {
        const employeeId =
          typeof employee === "string" ? employee : employee._id;

        queryClient.invalidateQueries({
          queryKey: payrollKeys.employee(employeeId),
        });
      }
    },
  });
}

// ============================================================================
// MARK PAYROLL AS PAID
// ============================================================================

export function useMarkPayrollAsPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payrollId,
      paymentData,
    }: {
      payrollId: string;
      paymentData: Omit<MarkPayrollPaidPayload, "payrollId">;
    }) => markPayrollAsPaid(payrollId, paymentData),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: payrollKeys.detail(response.data._id),
      });

      const employee = response.data.employee;

      if (employee) {
        const employeeId =
          typeof employee === "string" ? employee : employee._id;

        queryClient.invalidateQueries({
          queryKey: payrollKeys.employee(employeeId),
        });
      }
    },
  });
}
