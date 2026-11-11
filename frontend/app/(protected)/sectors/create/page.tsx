"use client";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import CreateSectorForm from "@/components/sectors/CreateSectorForm";
import { PageContainer } from "@/components/ui/PageHeader";

export default function CreateSectorPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "developer", "clerk"]}>
      <PageContainer>
        <CreateSectorForm />
      </PageContainer>
    </ProtectedRoute>
  );
}
