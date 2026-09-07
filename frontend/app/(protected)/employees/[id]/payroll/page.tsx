"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import PayrollTable from "@/components/payroll/PayrollTable";
import { useMe } from "@/hooks/auth/useMe";
import { useEmployeePayrolls } from "@/hooks/payroll/usePayroll";

interface EmployeePayrollPageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeePayrollPage({
  params,
}: EmployeePayrollPageProps) {
  const { id } = use(params);
  const { data: me } = useMe();
  const { data, isLoading, isError, error } = useEmployeePayrolls(id);
  const payrolls = data?.data ?? [];
  const canManage = ["developer", "admin", "clerk"].includes(
    me?.user.role ?? "",
  );

  return (
    <ProtectedRoute
      allowedRoles={["developer", "admin", "clerk", "supervisor"]}
    >
      <main className="space-y-5 p-4 sm:p-6">
        <Link
          href={`/employees/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to employee
        </Link>
        <header>
          <h1 className="text-2xl font-bold text-slate-900">
            Employee Payroll History
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {payrolls.length} payroll record{payrolls.length === 1 ? "" : "s"}
          </p>
        </header>
        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Loading payroll history...
          </div>
        )}
        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error.message}
          </div>
        )}
        {!isLoading && !isError && (
          <PayrollTable payrolls={payrolls} canManage={canManage} />
        )}
      </main>
    </ProtectedRoute>
  );
}
