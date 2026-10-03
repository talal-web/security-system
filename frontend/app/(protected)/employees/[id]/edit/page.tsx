"use client";

import { use } from "react";

import { useQuery } from "@tanstack/react-query";

import UpdateEmployeeForm from "@/components/employees/update/UpdateEmployeeForm";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { useSelectedArea } from "@/components/area/AreaContext";
import { getEmployeeById } from "@/services/employee.service";

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
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error instanceof Error ? error.message : "Error loading employee"}
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["developer", "admin", "clerk"]}>
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <UpdateEmployeeForm key={data._id} employee={data} />
      </main>
    </ProtectedRoute>
  );
}
