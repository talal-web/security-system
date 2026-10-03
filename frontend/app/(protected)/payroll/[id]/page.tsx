"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import PayrollActions from "@/components/payroll/PayrollActions";
import PayrollDetails from "@/components/payroll/PayrollDetails";
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
      <main className="space-y-5 p-4 sm:p-6">
        <Link
          href={getAreaAwareHref("/payroll")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to payroll
        </Link>
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
        {data?.data && (
          <>
            <PayrollActions payroll={data.data} canManage={canManage} />
            <PayrollDetails payroll={data.data} />
          </>
        )}
      </main>
    </ProtectedRoute>
  );
}
