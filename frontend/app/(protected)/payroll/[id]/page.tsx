"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import PayrollActions from "@/components/payroll/PayrollActions";
import PayrollDetails from "@/components/payroll/PayrollDetails";
import { PageContainer } from "@/components/ui/PageHeader";
import { ErrorState, LoadingState } from "@/components/ui/States";
import { useMe } from "@/hooks/auth/useMe";
import { usePayroll } from "@/hooks/payroll/usePayroll";
import { useSelectedArea } from "@/components/area/AreaContext";

interface PayrollDetailPageProps {
  params: Promise<{ id: string }>;
}
export default function PayrollDetailPage({ params }: PayrollDetailPageProps) {
  const { id } = use(params);
  const { getAreaAwareHref } = useSelectedArea();
  const { data: me } = useMe();
  const { data, isLoading, isError, error } = usePayroll(id);
  const canManage = ["developer", "admin", "clerk"].includes(
    me?.user.role ?? "",
  );
  return (
    <ProtectedRoute
      allowedRoles={["developer", "admin", "clerk", "supervisor"]}
    >
      <PageContainer>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={getAreaAwareHref("/payroll")}
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="size-4" />
            Back to payroll
          </Link>
          {data?.data && (
            <PayrollActions payroll={data.data} canManage={canManage} />
          )}
        </div>
        {isLoading && <LoadingState title="Loading payroll..." />}
        {isError && (
          <ErrorState title="Failed to load payroll" description={error.message} />
        )}
        {data?.data && <PayrollDetails payroll={data.data} />}
      </PageContainer>
    </ProtectedRoute>
  );
}
