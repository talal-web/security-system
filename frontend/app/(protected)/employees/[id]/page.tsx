"use client";

import { useParams } from "next/navigation";

import { useEmployeeById } from "@/hooks/employee/useEmployeeById";

import EmployeeDetail from "@/components/employees/view/detail/EmployeeDetail";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { PageContainer } from "@/components/ui/PageHeader";
import { ErrorState, LoadingState } from "@/components/ui/States";

export default function EmployeeDetailPage() {
  const params = useParams();

  const id = params.id as string;

  const { employee, loading, error } = useEmployeeById(id);

  if (loading) {
    return (
      <PageContainer>
        <LoadingState title="Loading employee..." />
      </PageContainer>
    );
  }

  if (error || !employee) {
    return (
      <PageContainer>
        <ErrorState title={error || "Unable to load employee."} />
      </PageContainer>
    );
  }

  return (
    <ProtectedRoute
      allowedRoles={["developer", "admin", "clerk", "supervisor"]}
    >
      <PageContainer>
        <EmployeeDetail employee={employee} />
      </PageContainer>
    </ProtectedRoute>
  );
}
