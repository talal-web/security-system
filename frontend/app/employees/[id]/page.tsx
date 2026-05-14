"use client";

import { useParams } from "next/navigation";

import { useEmployeeById } from "@/hooks/useEmployeeById";

import EmployeeDetail from "@/components/employees/EmployeeDetail";

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
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <EmployeeDetail employee={employee} />
    </main>
  );
}
