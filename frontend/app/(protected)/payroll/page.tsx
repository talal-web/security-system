"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import PayrollFilters from "@/components/payroll/PayrollFilters";
import PayrollHeader from "@/components/payroll/PayrollHeader";
import PayrollSummary from "@/components/payroll/PayrollSummary";
import PayrollTable from "@/components/payroll/PayrollTable";
import GeneratePayrollDialog from "@/components/payroll/GeneratePayrollDialog";
import GenerateMonthlyPayrollDialog from "@/components/payroll/GenerateMonthlyPayrollDialog";
import { useMe } from "@/hooks/auth/useMe";
import { usePayrolls } from "@/hooks/payroll/usePayroll";
import type { PayrollFilters as PayrollFilterValues } from "@/types/payroll";

export default function PayrollPage() {
  const now = new Date();

  const [filters, setFilters] = useState<PayrollFilterValues>({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    status: "all",
  });
  const [generateOpen, setGenerateOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const { data: me } = useMe();
  const canManage = ["developer", "admin", "clerk"].includes(
    me?.user.role ?? "",
  );
  const { data, isLoading, isError, error } = usePayrolls(filters);
  const payrolls = data?.data ?? [];
  return (
    <ProtectedRoute
      allowedRoles={["developer", "admin", "clerk", "supervisor"]}
    >
      <main className="space-y-5 p-4 sm:p-6">
        <PayrollHeader
          count={payrolls.length}
          canManage={canManage}
          payrolls={payrolls}
          filters={filters}
          onGenerate={() => setGenerateOpen(true)}
          onGenerateMonth={() => setMonthOpen(true)}
        />
        <PayrollFilters filters={filters} onChange={setFilters} />
        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Loading payroll...
          </div>
        )}
        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error.message}
          </div>
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
      </main>
    </ProtectedRoute>
  );
}
