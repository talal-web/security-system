"use client";

import { useState } from "react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";

import BonusSummary from "@/components/bonus/BonusSummary";
import BonusHistory from "@/components/bonus/BonusHistory";
import BonusModal from "@/components/bonus/BonusModal";
import BonusConfirmModal from "@/components/bonus/BonusConfirmModal";
import BonusFilters from "@/components/bonus/BonusFilters";
import BonusHeader from "@/components/bonus/BonusHeader";

import { useMe } from "@/hooks/auth/useMe";
import { useBonuses, useCancelBonus } from "@/hooks/bonus/useBonus";

import {
  getDefaultFromDate,
  getTodayDate,
} from "@/utils/date/getDefaultFilerDate";

import type { Bonus, BonusFilters as BonusFilterValues } from "@/types/bonus";

export default function BonusesPage() {
  const { data: me } = useMe();

  const canEdit = ["developer", "admin", "clerk"].includes(
    me?.user?.role ?? "",
  );

  // ============================================================
  // Filters
  // ============================================================

  const [filters, setFilters] = useState<BonusFilterValues>({
    fromDate: getDefaultFromDate(),
    toDate: getTodayDate(),
  });

  // ============================================================
  // Modals
  // ============================================================

  const [showForm, setShowForm] = useState(false);

  const [editingBonus, setEditingBonus] = useState<Bonus | null>(null);

  const [cancelBonus, setCancelBonus] = useState<Bonus | null>(null);

  // ============================================================
  // Query
  // ============================================================

  const { data, isLoading, isError, error } = useBonuses(filters);

  const cancelMutation = useCancelBonus();

  const bonuses = data?.data ?? [];

  // ============================================================
  // Create / Edit
  // ============================================================

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

  // ============================================================
  // Cancel
  // ============================================================

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

        <BonusHeader
          bonuses={bonuses}
          filters={filters}
          canEdit={canEdit}
          onAdd={handleAdd}
        />

        {/* ======================================================
            Filters
        ====================================================== */}

        <BonusFilters filters={filters} onChange={setFilters} />

        {/* ======================================================
            Loading
        ====================================================== */}

        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-500">Loading bonuses...</p>
          </div>
        )}

        {/* ======================================================
            Error
        ====================================================== */}

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

        {/* ======================================================
            Content
        ====================================================== */}

        {!isLoading && !isError && (
          <>
            <BonusSummary bonuses={bonuses} />

            {bonuses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-medium text-slate-600">
                  No bonus records found.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Try changing your filters or add a new bonus record.
                </p>
              </div>
            ) : (
              <BonusHistory
                bonuses={bonuses}
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

        <BonusModal open={showForm} onClose={closeForm} bonus={editingBonus} />

        {/* ======================================================
            Cancel Confirmation
        ====================================================== */}

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
