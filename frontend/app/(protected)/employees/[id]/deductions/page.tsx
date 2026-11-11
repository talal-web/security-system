"use client";

import { use, useState } from "react";
import { ClipboardMinus, Plus } from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { ErrorState, LoadingState } from "@/components/ui/States";
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
      <PageContainer>
        {/* Loading */}
        {isLoading && <LoadingState title="Loading deductions..." />}

        {/* Error */}
        {isError && (
          <ErrorState
            title="Failed to load deductions."
            description={
              error instanceof Error
                ? error.message
                : "Something went wrong while loading deductions."
            }
          />
        )}

        {/* Content */}
        {!isLoading && !isError && employee && (
          <>
            {/* Header */}
            <PageHeader
              title="Employee Deductions"
              description={`${employee.name} · ${employee.empId} · ${employee.designation}`}
              icon={ClipboardMinus}
              actions={
                canEdit && (
                  <Button onClick={handleAdd}>
                    <Plus />
                    Add Deduction
                  </Button>
                )
              }
            />

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
      </PageContainer>
    </ProtectedRoute>
  );
}
