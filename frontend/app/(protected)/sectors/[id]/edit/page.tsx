"use client";

import { use } from "react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import UpdateSectorForm from "@/components/sectors/UpdateSectorForm";

export default function EditSectorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <ProtectedRoute allowedRoles={["admin", "developer"]}>
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <UpdateSectorForm id={id} />
      </main>
    </ProtectedRoute>
  );
}
