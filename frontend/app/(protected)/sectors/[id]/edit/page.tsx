"use client";

import { use } from "react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import UpdateSectorForm from "@/components/sectors/UpdateSectorForm";
import { PageContainer } from "@/components/ui/PageHeader";

export default function EditSectorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <ProtectedRoute allowedRoles={["developer", "admin", "clerk"]}>
      <PageContainer>
        <UpdateSectorForm id={id} />
      </PageContainer>
    </ProtectedRoute>
  );
}
