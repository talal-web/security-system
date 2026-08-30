"use client";

import { useState } from "react";
import { toast } from "sonner";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";

import DeductionModal from "@/components/deduction/DeductionModal";
import DeductionConfirmModal from "@/components/deduction/DeductionConfirmModal";
import DeductionFilters from "@/components/deduction/DeductionFilters";
import DeductionHistory from "@/components/deduction/DeductionHistory";
import DeductionSummary from "@/components/deduction/DeductionSummary";
import DeductionHeader from "@/components/deduction/DeductionHeader";

import { useMe } from "@/hooks/auth/useMe";

import {
  useCancelDeduction,
  useDeductions,
} from "@/hooks/deduction/useDeduction";

import type {
  Deduction,
  DeductionFilters as DeductionFilterValues,
} from "@/types/deduction";

export default function DeductionsPage() {
  const { data: me } = useMe();

  const userRole = me?.user?.role;

  const canEdit = ["developer", "admin", "clerk"].includes(userRole ?? "");

  // ============================================================
  // Filters
  // ============================================================

  const [filters, setFilters] = useState<DeductionFilterValues>({});

  // ============================================================
  // Modals
  // ============================================================

  const [showForm, setShowForm] = useState(false);

  const [editingDeduction, setEditingDeduction] = useState<Deduction | null>(
    null,
  );

  const [cancellingDeduction, setCancellingDeduction] =
    useState<Deduction | null>(null);

  // ============================================================
  // Query
  // ============================================================

  const { data, isLoading, isError, error } = useDeductions(filters);

  const cancelMutation = useCancelDeduction();

  const deductions = data?.data ?? [];

  // ============================================================
  // Add
  // ============================================================

  const handleAdd = () => {
    setEditingDeduction(null);
    setShowForm(true);
  };

  // ============================================================
  // Edit
  // ============================================================

  const handleEdit = (deduction: Deduction) => {
    setEditingDeduction(deduction);
    setShowForm(true);
  };

  // ============================================================
  // Close Form
  // ============================================================

  const closeForm = () => {
    setShowForm(false);
    setEditingDeduction(null);
  };

  // ============================================================
  // Cancel
  // ============================================================

  const handleCancel = (deduction: Deduction) => {
    setCancellingDeduction(deduction);
  };

  const confirmCancel = () => {
    if (!cancellingDeduction) return;

    cancelMutation.mutate(cancellingDeduction._id, {
      onSuccess: () => {
        toast.success("Deduction cancelled successfully.");
      },

      onError: (mutationError) => {
        toast.error(
          mutationError instanceof Error
            ? mutationError.message
            : "Failed to cancel deduction.",
        );
      },

      onSettled: () => {
        setCancellingDeduction(null);
      },
    });
  };

  // ============================================================
  // Render
  // ============================================================

  return (
    <ProtectedRoute
      allowedRoles={["developer", "admin", "clerk", "supervisor"]}
    >
      <main className="space-y-6 p-4 sm:p-6">
        {/* ======================================================
            Header
        ====================================================== */}

        <DeductionHeader
          deductions={deductions}
          filters={filters}
          canEdit={canEdit}
          onAdd={handleAdd}
        />

        {/* ======================================================
            Filters
        ====================================================== */}

        <DeductionFilters filters={filters} onChange={setFilters} />

        {/* ======================================================
            Loading
        ====================================================== */}

        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-500">Loading deductions...</p>
          </div>
        )}

        {/* ======================================================
            Error
        ====================================================== */}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
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

        {/* ======================================================
            Results
        ====================================================== */}

        {!isLoading && !isError && (
          <>
            <DeductionSummary deductions={deductions} />

            {deductions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-sm text-slate-500">
                  No deduction records found.
                </p>
              </div>
            ) : (
              <DeductionHistory
                deductions={deductions}
                canEdit={canEdit}
                onEdit={canEdit ? handleEdit : undefined}
                onCancel={canEdit ? handleCancel : undefined}
              />
            )}
          </>
        )}

        {/* ======================================================
            Create / Edit Modal
        ====================================================== */}

        {showForm && canEdit && (
          <DeductionModal
            open
            onClose={closeForm}
            deduction={editingDeduction}
          />
        )}

        {/* ======================================================
            Cancel Confirmation
        ====================================================== */}

        <DeductionConfirmModal
          open={Boolean(cancellingDeduction)}
          deduction={cancellingDeduction}
          loading={cancelMutation.isPending}
          onConfirm={confirmCancel}
          onClose={() => {
            if (!cancelMutation.isPending) {
              setCancellingDeduction(null);
            }
          }}
        />
      </main>
    </ProtectedRoute>
  );
}
