"use client";

import { use, useState } from "react";
import { Gift, Plus } from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { ErrorState, LoadingState } from "@/components/ui/States";
import BonusSummary from "@/components/bonus/BonusSummary";
import BonusHistory from "@/components/bonus/BonusHistory";
import BonusModal from "@/components/bonus/BonusModal";
import BonusConfirmModal from "@/components/bonus/BonusConfirmModal";

import { useMe } from "@/hooks/auth/useMe";
import { useCancelBonus, useEmployeeBonuses } from "@/hooks/bonus/useBonus";

import type { Bonus } from "@/types/bonus";

interface EmployeeBonusesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EmployeeBonusesPage({
  params,
}: EmployeeBonusesPageProps) {
  const { id: employeeId } = use(params);
  const { data: me } = useMe();

  const canEdit = ["developer", "admin", "clerk"].includes(
    me?.user?.role ?? "",
  );

  const { data, isLoading, isError, error } = useEmployeeBonuses(employeeId);

  const cancelMutation = useCancelBonus(employeeId);

  const [showForm, setShowForm] = useState(false);
  const [editingBonus, setEditingBonus] = useState<Bonus | null>(null);
  const [cancelBonus, setCancelBonus] = useState<Bonus | null>(null);

  const employee = data?.data.employee;
  const bonuses = data?.data.bonuses ?? [];

  // ======================================
  // Form
  // ======================================

  const handleAdd = () => {
    setEditingBonus(null);
    setShowForm(true);
  };

  const handleEdit = (bonus: Bonus) => {
    setEditingBonus(bonus);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBonus(null);
  };

  // ======================================
  // Cancel
  // ======================================

  const handleCancel = (bonus: Bonus) => {
    setCancelBonus(bonus);
  };

  const confirmCancel = () => {
    if (!cancelBonus) return;

    cancelMutation.mutate(cancelBonus._id, {
      onSuccess: () => {
        setCancelBonus(null);
      },
    });
  };

  return (
    <ProtectedRoute
      allowedRoles={["developer", "admin", "clerk", "supervisor"]}
    >
      <PageContainer>
        {/* Loading */}
        {isLoading && <LoadingState title="Loading bonuses..." />}

        {/* Error */}
        {isError && (
          <ErrorState
            title="Failed to load bonuses."
            description={
              error instanceof Error
                ? error.message
                : "Something went wrong while loading bonuses."
            }
          />
        )}

        {/* Content */}
        {!isLoading && !isError && employee && (
          <>
            {/* Header */}
            <PageHeader
              title="Employee Bonuses"
              description={`${employee.name} · ${employee.empId} · ${employee.designation}`}
              icon={Gift}
              actions={
                canEdit && (
                  <Button onClick={handleAdd}>
                    <Plus />
                    Add Bonus
                  </Button>
                )
              }
            />

            {/* Summary */}
            <BonusSummary bonuses={bonuses} />

            {/* History */}
            <BonusHistory
              bonuses={bonuses}
              canEdit={canEdit}
              onEdit={canEdit ? handleEdit : undefined}
              onCancel={canEdit ? handleCancel : undefined}
            />
          </>
        )}

        {/* Create / Edit */}
        <BonusModal
          open={showForm}
          onClose={closeForm}
          employeeId={employeeId}
          bonus={editingBonus}
        />

        {/* Cancel Confirmation */}
        <BonusConfirmModal
          open={Boolean(cancelBonus)}
          bonus={cancelBonus}
          loading={cancelMutation.isPending}
          onConfirm={confirmCancel}
          onClose={() => {
            if (!cancelMutation.isPending) {
              setCancelBonus(null);
            }
          }}
        />
      </PageContainer>
    </ProtectedRoute>
  );
}
