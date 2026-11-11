"use client";

import { useState } from "react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";

import BonusSummary from "@/components/bonus/BonusSummary";
import BonusHistory from "@/components/bonus/BonusHistory";
import BonusModal from "@/components/bonus/BonusModal";
import BonusConfirmModal from "@/components/bonus/BonusConfirmModal";
import BonusFilters from "@/components/bonus/BonusFilters";
import BonusHeader from "@/components/bonus/BonusHeader";
import { PageContainer } from "@/components/ui/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";

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
      <PageContainer>
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

        {isLoading && <LoadingState title="Loading bonuses..." />}

        {/* ======================================================
            Error
        ====================================================== */}

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

        {/* ======================================================
            Content
        ====================================================== */}

        {!isLoading && !isError && (
          <>
            <BonusSummary bonuses={bonuses} />

            {bonuses.length === 0 ? (
              <EmptyState
                title="No bonus records found."
                description="Try changing your filters or add a new bonus record."
              />
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
      </PageContainer>
    </ProtectedRoute>
  );
}
