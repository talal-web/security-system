"use client";

import CreateEmployeeForm from "@/components/employees/create/CreateEmployeeForm";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { PageContainer } from "@/components/ui/PageHeader";

export default function CreateEmployeePage() {
  return (
    <ProtectedRoute allowedRoles={["developer", "admin", "clerk"]}>
      <PageContainer className="max-w-5xl">
        <CreateEmployeeForm />
      </PageContainer>
    </ProtectedRoute>
  );
}
