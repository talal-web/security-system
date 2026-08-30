"use client";

import { useParams } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

import { useEmployeeById } from "@/hooks/employee/useEmployeeById";

import EmployeeDetail from "@/components/employees/view/detail/EmployeeDetail";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

export default function EmployeeDetailPage() {
  const params = useParams();

  const id = params.id as string;

  const { employee, loading, error } = useEmployeeById(id);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading employee...
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="flex max-w-md items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error || "Unable to load employee."}</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute
      allowedRoles={["developer", "admin", "clerk", "supervisor"]}
    >
      <main className="min-h-screen bg-slate-50 px-4 py-6">
        <EmployeeDetail employee={employee} />
      </main>
    </ProtectedRoute>
  );
}
