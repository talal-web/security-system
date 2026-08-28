"use client";

import CreateEmployeeForm from "@/components/employees/create/CreateEmployeeForm";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

export default function CreateEmployeePage() {
  return (
    <ProtectedRoute allowedRoles={["developer", "admin", "clerk"]}>
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <CreateEmployeeForm />
        </div>
      </main>
    </ProtectedRoute>
  );
}
