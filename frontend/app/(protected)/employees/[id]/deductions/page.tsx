"use client";

import { use, useState } from "react";
import { Plus } from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DeductionSummary from "@/components/deduction/DeductionSummary";
import DeductionHistory from "@/components/deduction/DeductionHistory";
import DeductionModal from "@/components/deduction/DeductionModal";
import DeductionConfirmModal from "@/components/deduction/DeductionConfirmModal";

import { useMe } from "@/hooks/auth/useMe";
import {
  useEmployeeDeductions,
  useCancelDeduction,
} from "@/hooks/deduction/useDeduction";

import type { Deduction } from "@/types/deduction";

interface EmployeeDeductionsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EmployeeDeductionsPage({
  params,
}: EmployeeDeductionsPageProps) {
  const { id: employeeId } = use(params);
  const { data: me } = useMe();

  const canEdit = ["developer", "admin", "clerk"].includes(
    me?.user?.role ?? "",
  );

  const { data, isLoading, isError, error } = useEmployeeDeductions(employeeId);

  const cancelMutation = useCancelDeduction(employeeId);

  const [showForm, setShowForm] = useState(false);
  const [editingDeduction, setEditingDeduction] = useState<Deduction | null>(
    null,
  );
  const [cancelDeduction, setCancelDeduction] = useState<Deduction | null>(
    null,
  );

  const employee = data?.data.employee;
  const deductions = data?.data.deductions ?? [];

  const closeForm = () => {
    setShowForm(false);
    setEditingDeduction(null);
  };

  const handleAdd = () => {
    setEditingDeduction(null);
    setShowForm(true);
  };

  const handleEdit = (deduction: Deduction) => {
    setEditingDeduction(deduction);
    setShowForm(true);
  };

  const handleCancel = (deduction: Deduction) => {
    setCancelDeduction(deduction);
  };

  const confirmCancel = () => {
    if (!cancelDeduction) return;

    cancelMutation.mutate(cancelDeduction._id, {
      onSuccess: () => {
        setCancelDeduction(null);
      },
    });
  };

  return (
    <ProtectedRoute
      allowedRoles={["developer", "admin", "clerk", "supervisor"]}
    >
      <main className="space-y-6 p-4 sm:p-6">
        {/* Loading */}
        {isLoading && (
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Loading deductions...</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-semibold text-red-700">
              Failed to load deductions.
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error instanceof Error
                ? error.message
                : "Something went wrong while loading deductions."}
            </p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && employee && (
          <>
            {/* Header */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  Employee Deductions
                </h1>

                <p className="mt-1 truncate text-sm text-gray-500">
                  {employee.name} · {employee.empId} · {employee.designation}
                </p>
              </div>

              {canEdit && (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add Deduction
                </button>
              )}
            </header>

            {/* Summary */}
            <DeductionSummary deductions={deductions} />

            {/* History */}
            <DeductionHistory
              deductions={deductions}
              canEdit={canEdit}
              onEdit={canEdit ? handleEdit : undefined}
              onCancel={canEdit ? handleCancel : undefined}
            />
          </>
        )}

        {/* Create / Edit */}
        <DeductionModal
          open={showForm}
          onClose={closeForm}
          employeeId={employeeId}
          deduction={editingDeduction}
        />

        {/* Cancel Confirmation */}
        <DeductionConfirmModal
          open={Boolean(cancelDeduction)}
          deduction={cancelDeduction}
          loading={cancelMutation.isPending}
          onConfirm={confirmCancel}
          onClose={() => {
            if (!cancelMutation.isPending) {
              setCancelDeduction(null);
            }
          }}
        />
      </main>
    </ProtectedRoute>
  );
}
