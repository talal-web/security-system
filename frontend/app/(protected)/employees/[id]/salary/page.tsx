"use client";

import { use, useState } from "react";

import { Landmark } from "lucide-react";

import { useMe } from "@/hooks/auth/useMe";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { ErrorState, LoadingState } from "@/components/ui/States";

import EmployeeSalaryCard from "@/components/employeeSalary/EmployeeSalaryCard";
import SalaryHistory from "@/components/employeeSalary/SalaryHistory";
import SalaryForm from "@/components/employeeSalary/SalaryForm";

import {
  useCurrentEmployeeSalary,
  useEmployeeSalaryHistory,
} from "@/hooks/employeeSalary/useEmployeeSalary";

import type { EmployeeSalary } from "@/types/employeeSalary";
import { ApiError } from "@/lib/apiError";

interface EmployeeSalaryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EmployeeSalaryPage({
  params,
}: EmployeeSalaryPageProps) {
  const { id: employeeId } = use(params);
  const { data: me } = useMe();

  const userRole = me?.user?.role;
  const canEditSalary = ["developer", "admin", "clerk"].includes(
    userRole ?? "",
  );

  const [showForm, setShowForm] = useState(false);
  const [editingSalary, setEditingSalary] = useState<EmployeeSalary | null>(
    null,
  );

  const currentSalaryQuery = useCurrentEmployeeSalary(employeeId);

  const historyQuery = useEmployeeSalaryHistory(employeeId);

  const employee =
    currentSalaryQuery.data?.data.employee ?? historyQuery.data?.data.employee;

  const currentSalary = currentSalaryQuery.data?.data.salary;

  const salaryHistory = historyQuery.data?.data.salaryHistory ?? [];

  const currentSalaryIsMissing =
    currentSalaryQuery.error instanceof ApiError &&
    currentSalaryQuery.error.status === 404 &&
    Boolean(historyQuery.data);

  const queryError =
    historyQuery.error ??
    (currentSalaryQuery.error && !currentSalaryIsMissing
      ? currentSalaryQuery.error
      : undefined);

  const handleAddSalary = () => {
    setEditingSalary(null);
    setShowForm(true);
  };

  const handleEditSalary = (salary: EmployeeSalary) => {
    setEditingSalary(salary);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSalary(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingSalary(null);
  };

  const isLoading = currentSalaryQuery.isLoading || historyQuery.isLoading;

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState title="Loading salary information..." />
      </PageContainer>
    );
  }

  if (!employee) {
    return (
      <PageContainer>
        <ErrorState
          title={
            queryError
              ? "Unable to load salary information"
              : "Employee not found"
          }
          description={
            queryError instanceof Error
              ? queryError.message
              : "Unable to load employee salary information."
          }
        />
      </PageContainer>
    );
  }

  return (
    <ProtectedRoute
      allowedRoles={["developer", "admin", "clerk", "supervisor"]}
    >
      <PageContainer>
        {/* Header */}
        <PageHeader
          title="Employee Salary"
          icon={Landmark}
          description={
            <>
              {employee.name} · {employee.empId} · {employee.designation}
            </>
          }
        />

        {/* Current Salary */}
        <EmployeeSalaryCard
          salary={currentSalary}
          canEdit={canEditSalary}
          onAdd={canEditSalary ? handleAddSalary : undefined}
          onEdit={canEditSalary ? handleEditSalary : undefined}
        />

        {/* Salary Form */}
        {showForm && canEditSalary && (
          <SalaryForm
            employeeId={employeeId}
            salary={editingSalary}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}

        {/* Salary History */}
        <SalaryHistory
          salaryHistory={salaryHistory}
          onEdit={canEditSalary ? handleEditSalary : undefined}
          canEdit={canEditSalary}
        />
      </PageContainer>
    </ProtectedRoute>
  );
}
