"use client";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import CreateSectorForm from "@/components/sectors/CreateSectorForm";

export default function CreateSectorPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "developer", "clerk"]}>
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <CreateSectorForm />
      </main>
    </ProtectedRoute>
  );
}
