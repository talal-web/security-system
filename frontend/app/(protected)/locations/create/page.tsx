"use client";

import CreateLocationForm from "@/components/locations/CreateLocationForm";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { PageContainer } from "@/components/ui/PageHeader";

export default function CreateLocationPage() {
  return (
    <ProtectedRoute allowedRoles={["developer", "admin", "clerk"]}>
      <PageContainer>
        <CreateLocationForm />
      </PageContainer>
    </ProtectedRoute>
  );
}
