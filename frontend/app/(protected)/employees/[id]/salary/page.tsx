"use client";

import { use, useState } from "react";

import { useMe } from "@/hooks/auth/useMe";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

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
      <main className="p-6">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">Loading salary information...</p>
        </div>
      </main>
    );
  }

  if (!employee) {
    return (
      <main className="p-6">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {queryError
              ? "Unable to load salary information"
              : "Employee not found"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {queryError instanceof Error
              ? queryError.message
              : "Unable to load employee salary information."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <ProtectedRoute
      allowedRoles={["developer", "admin", "clerk", "supervisor"]}
    >
      <main className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Salary</h1>

          <p className="mt-1 text-sm text-gray-500">
            {employee.name} · {employee.empId} · {employee.designation}
          </p>
        </div>

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
      </main>
    </ProtectedRoute>
  );
}
