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

  area: (areaId: string) => [...payrollKeys.all, areaId] as const,

  lists: (areaId: string) => [...payrollKeys.area(areaId), "list"] as const,

  list: (areaId: string, filters?: PayrollFilters) =>
    [...payrollKeys.lists(areaId), filters] as const,

  details: (areaId: string) => [...payrollKeys.area(areaId), "detail"] as const,

  detail: (areaId: string, payrollId: string) =>
    [...payrollKeys.details(areaId), payrollId] as const,

  employee: (areaId: string, employeeId: string) =>
    [...payrollKeys.area(areaId), "employee", employeeId] as const,
};

// ============================================================================
// GET ALL PAYROLLS
// ============================================================================

export function usePayrolls(filters?: PayrollFilters) {
  const { selectedAreaId } = useSelectedArea();
  const effectiveFilters = {
    ...filters,
    area: selectedAreaId ?? undefined,
  };

  return useQuery({
    queryKey: selectedAreaId
      ? payrollKeys.list(selectedAreaId, effectiveFilters)
      : [...payrollKeys.all, "disabled", "list"],
    queryFn: () => getPayrolls(effectiveFilters, selectedAreaId!),
    enabled: !!selectedAreaId,
  });
}

// ============================================================================
// GET SINGLE PAYROLL
// ============================================================================

export function usePayroll(payrollId: string) {
  const { selectedAreaId } = useSelectedArea();

  return useQuery({
    queryKey: selectedAreaId
      ? payrollKeys.detail(selectedAreaId, payrollId)
      : [...payrollKeys.all, "disabled", "detail", payrollId],
    queryFn: () => getPayrollById(payrollId, selectedAreaId!),
    enabled: Boolean(payrollId) && !!selectedAreaId,
  });
}

// ============================================================================
// GET EMPLOYEE PAYROLLS
// ============================================================================

export function useEmployeePayrolls(employeeId: string) {
  const { selectedAreaId } = useSelectedArea();

  return useQuery({
    queryKey: selectedAreaId
      ? payrollKeys.employee(selectedAreaId, employeeId)
      : [...payrollKeys.all, "disabled", "employee", employeeId],
    queryFn: () => getEmployeePayrolls(employeeId, selectedAreaId!),
    enabled: Boolean(employeeId) && !!selectedAreaId,
  });
}

// ============================================================================
// GENERATE SINGLE PAYROLL
// ============================================================================

export function useGeneratePayroll() {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (payrollData: GeneratePayrollPayload) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return generatePayroll(payrollData, selectedAreaId);
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.area(selectedAreaId!),
      });

      const employee = response.data.employee;

      if (employee) {
        const employeeId =
          typeof employee === "string" ? employee : employee._id;

        queryClient.invalidateQueries({
          queryKey: payrollKeys.employee(selectedAreaId!, employeeId),
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
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (payrollData: GenerateMonthlyPayrollPayload) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return generateMonthlyPayroll(payrollData, selectedAreaId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.area(selectedAreaId!),
      });
    },
  });
}

// ============================================================================
// RECALCULATE SINGLE PAYROLL
// ============================================================================

export function useRecalculatePayroll() {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (payrollId: string) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return recalculatePayroll(payrollId, selectedAreaId);
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.area(selectedAreaId!),
      });

      queryClient.invalidateQueries({
        queryKey: payrollKeys.detail(selectedAreaId!, response.data._id),
      });

      const employee = response.data.employee;

      if (employee) {
        const employeeId =
          typeof employee === "string" ? employee : employee._id;

        queryClient.invalidateQueries({
          queryKey: payrollKeys.employee(selectedAreaId!, employeeId),
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
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (payrollData: RecalculateMonthlyPayrollPayload) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return recalculateMonthlyPayroll(payrollData, selectedAreaId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.area(selectedAreaId!),
      });
    },
  });
}

// ============================================================================
// FINALIZE PAYROLL
// ============================================================================

export function useFinalizePayroll() {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (payrollId: string) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return finalizePayroll(payrollId, selectedAreaId);
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.area(selectedAreaId!),
      });

      queryClient.invalidateQueries({
        queryKey: payrollKeys.detail(selectedAreaId!, response.data._id),
      });

      const employee = response.data.employee;

      if (employee) {
        const employeeId =
          typeof employee === "string" ? employee : employee._id;

        queryClient.invalidateQueries({
          queryKey: payrollKeys.employee(selectedAreaId!, employeeId),
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
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: ({
      payrollId,
      paymentData,
    }: {
      payrollId: string;
      paymentData: Omit<MarkPayrollPaidPayload, "payrollId">;
    }) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return markPayrollAsPaid(payrollId, paymentData, selectedAreaId);
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.area(selectedAreaId!),
      });

      queryClient.invalidateQueries({
        queryKey: payrollKeys.detail(selectedAreaId!, response.data._id),
      });

      const employee = response.data.employee;

      if (employee) {
        const employeeId =
          typeof employee === "string" ? employee : employee._id;

        queryClient.invalidateQueries({
          queryKey: payrollKeys.employee(selectedAreaId!, employeeId),
        });
      }
    },
  });
}
