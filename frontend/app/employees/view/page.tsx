// src/app/employees/page.tsx

"use client";

import EmployeeCard from "@/components/employees/EmployeeCard";

import { useEmployees } from "@/hooks/useEmployees";

export default function EmployeesPage() {
  const { employees, loading, error } = useEmployees();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <h2 className="text-xl font-semibold text-slate-700">
          Loading employees...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <h2 className="text-xl font-semibold text-red-600">{error}</h2>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-28">
      {/* Header */}
      <div className="mx-auto mb-12 max-w-7xl">
        <h1 className="text-4xl font-black text-slate-900">Employees</h1>

        <p className="mt-3 text-slate-600">
          Manage all security employees and staff records.
        </p>
      </div>

      {/* Employees Grid */}
      <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {employees.map((employee) => (
          <EmployeeCard key={employee._id} employee={employee} />
        ))}
      </div>
    </main>
  );
}
