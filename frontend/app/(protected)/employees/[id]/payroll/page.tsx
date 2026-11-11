"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, WalletCards } from "lucide-react";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import PayrollTable from "@/components/payroll/PayrollTable";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { ErrorState, LoadingState } from "@/components/ui/States";
import { useMe } from "@/hooks/auth/useMe";
import { useEmployeePayrolls } from "@/hooks/payroll/usePayroll";
import { useSelectedArea } from "@/components/area/AreaContext";

interface EmployeePayrollPageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeePayrollPage({
  params,
}: EmployeePayrollPageProps) {
  const { id } = use(params);
  const { getAreaAwareHref } = useSelectedArea();
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
      <PageContainer>
        <Link
          href={getAreaAwareHref(`/employees/${id}`)}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Back to employee
        </Link>
        <PageHeader
          title="Employee Payroll History"
          icon={WalletCards}
          description={`${payrolls.length} payroll record${payrolls.length === 1 ? "" : "s"}`}
        />
        {isLoading && <LoadingState title="Loading payroll history..." />}
        {isError && (
          <ErrorState
            title="Failed to load payroll history"
            description={error.message}
          />
        )}
        {!isLoading && !isError && (
          <PayrollTable payrolls={payrolls} canManage={canManage} />
        )}
      </PageContainer>
    </ProtectedRoute>
  );
}
