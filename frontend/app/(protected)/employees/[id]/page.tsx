"use client";

import { useParams } from "next/navigation";

import { useEmployeeById } from "@/hooks/employee/useEmployeeById";

import EmployeeDetail from "@/components/employees/view/detail/EmployeeDetail";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

export default function EmployeeDetailPage() {
  const params = useParams();

  const id = params.id as string;

  const { employee, loading, error } = useEmployeeById(id);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading employee...</p>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error}
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
