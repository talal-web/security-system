"use client";

import { use, useState } from "react";
import { Plus } from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
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
      <main className="space-y-6 p-4 sm:p-6">
        {/* Loading */}
        {isLoading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Loading bonuses...</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-semibold text-red-700">
              Failed to load bonuses.
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error instanceof Error
                ? error.message
                : "Something went wrong while loading bonuses."}
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
                  Employee Bonuses
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
                  Add Bonus
                </button>
              )}
            </header>

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
      </main>
    </ProtectedRoute>
  );
}
