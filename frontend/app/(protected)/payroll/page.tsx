"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import PayrollFilters from "@/components/payroll/PayrollFilters";
import PayrollHeader from "@/components/payroll/PayrollHeader";
import PayrollSummary from "@/components/payroll/PayrollSummary";
import PayrollTable from "@/components/payroll/PayrollTable";
import GeneratePayrollDialog from "@/components/payroll/GeneratePayrollDialog";
import GenerateMonthlyPayrollDialog from "@/components/payroll/GenerateMonthlyPayrollDialog";
import { PageContainer } from "@/components/ui/PageHeader";
import { ErrorState, LoadingState } from "@/components/ui/States";
import { useMe } from "@/hooks/auth/useMe";
import { usePayrolls } from "@/hooks/payroll/usePayroll";
import type { PayrollFilters as PayrollFilterValues } from "@/types/payroll";

export default function PayrollPage() {
  const now = new Date();

  const [filters, setFilters] = useState<PayrollFilterValues>({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    status: "all",
    employeeStatus: "active",
  });
  const [generateOpen, setGenerateOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const { data: me } = useMe();
  const canManage = ["developer", "admin", "clerk"].includes(
    me?.user.role ?? "",
  );
  // employeeStatus has no backend support; it's applied client-side below.
  const { employeeStatus, ...serverFilters } = filters;
  const { data, isLoading, isError, error } = usePayrolls(serverFilters);
  const allPayrolls = data?.data ?? [];
  const payrolls =
    !employeeStatus || employeeStatus === "all"
      ? allPayrolls
      : allPayrolls.filter((payroll) => {
          const employee = payroll.employee;
          const status =
            typeof employee === "string" ? undefined : employee?.status;
          return status === employeeStatus;
        });
  return (
    <ProtectedRoute
      allowedRoles={["developer", "admin", "clerk", "supervisor"]}
    >
      <PageContainer>
        <PayrollHeader
          count={payrolls.length}
          canManage={canManage}
          payrolls={payrolls}
          filters={filters}
          onGenerate={() => setGenerateOpen(true)}
          onGenerateMonth={() => setMonthOpen(true)}
        />
        <PayrollFilters filters={filters} onChange={setFilters} />
        {isLoading && <LoadingState title="Loading payroll..." />}
        {isError && (
          <ErrorState title="Failed to load payroll" description={error.message} />
        )}
        {!isLoading && !isError && (
          <>
            <PayrollSummary payrolls={payrolls} />
            <PayrollTable payrolls={payrolls} canManage={canManage} />
          </>
        )}
        <GeneratePayrollDialog
          open={generateOpen}
          onClose={() => setGenerateOpen(false)}
        />
        <GenerateMonthlyPayrollDialog
          open={monthOpen}
          onClose={() => setMonthOpen(false)}
        />
      </PageContainer>
    </ProtectedRoute>
  );
}
