"use client";

import { use } from "react";

import { useQuery } from "@tanstack/react-query";

import UpdateEmployeeForm from "@/components/employees/update/UpdateEmployeeForm";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { useSelectedArea } from "@/components/area/AreaContext";
import { getEmployeeById } from "@/services/employee.service";
import { PageContainer } from "@/components/ui/PageHeader";
import { ErrorState, LoadingState } from "@/components/ui/States";

export default function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { selectedAreaId } = useSelectedArea();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["employee", id, selectedAreaId],
    queryFn: () => getEmployeeById(id, selectedAreaId!),
    enabled: !!id && !!selectedAreaId,
  });

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState title="Loading..." />
      </PageContainer>
    );
  }

  if (isError || !data) {
    return (
      <PageContainer>
        <ErrorState
          title={error instanceof Error ? error.message : "Error loading employee"}
        />
      </PageContainer>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["developer", "admin", "clerk"]}>
      <PageContainer className="max-w-6xl">
        <UpdateEmployeeForm key={data._id} employee={data} />
      </PageContainer>
    </ProtectedRoute>
  );
}
