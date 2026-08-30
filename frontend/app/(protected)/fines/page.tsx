"use client";

import { useState } from "react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import FineHeader from "@/components/fine/FineHeader";
import FineFilters from "@/components/fine/FineFilters";
import FineSummary from "@/components/fine/FineSummary";
import FineHistory from "@/components/fine/FineHistory";
import FineModal from "@/components/fine/FineModal";
import FineConfirmModal from "@/components/fine/FineConfirmModal";

import { useMe } from "@/hooks/auth/useMe";
import { useFines, useCancelFine } from "@/hooks/fine/useFine";

import type { Fine, FineFilters as FineFiltersType } from "@/types/fine";
import {
  getDefaultFromDate,
  getTodayDate,
} from "@/utils/date/getDefaultFilerDate";

export default function FinesPage() {
  const { data: me } = useMe();

  const userRole = me?.user?.role;

  const canEdit = ["developer", "admin", "clerk"].includes(userRole ?? "");

  // ============================================================
  // State
  // ============================================================

  const [filters, setFilters] = useState<FineFiltersType>({
    fromDate: getDefaultFromDate(),
    toDate: getTodayDate(),
  });

  const [showForm, setShowForm] = useState(false);

  const [editingFine, setEditingFine] = useState<Fine | null>(null);

  const [cancelFine, setCancelFine] = useState<Fine | null>(null);

  // ============================================================
  // Queries
  // ============================================================

  const {
    data: finesData,
    isLoading: finesLoading,
    isError: finesError,
    error: finesErrorData,
  } = useFines(filters);

  // ============================================================
  // Mutations
  // ============================================================

  const cancelMutation = useCancelFine();

  const fines = finesData?.data ?? [];

  // ============================================================
  // Form Handlers
  // ============================================================

  const closeForm = () => {
    setShowForm(false);
    setEditingFine(null);
  };

  const handleAdd = () => {
    setEditingFine(null);
    setShowForm(true);
  };

  const handleEdit = (fine: Fine) => {
    setEditingFine(fine);
    setShowForm(true);
  };

  const handleCancel = (fine: Fine) => {
    setCancelFine(fine);
  };

  const confirmCancel = () => {
    if (!cancelFine) return;

    cancelMutation.mutate(cancelFine._id, {
      onSuccess: () => {
        setCancelFine(null);
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
      <main className="space-y-5 p-4 sm:p-6">
        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <FineHeader
          fines={fines}
          filters={filters}
          canEdit={canEdit}
          onAdd={handleAdd}
        />

        {/* ====================================================== */}
        {/* FILTERS */}
        {/* ====================================================== */}

        <FineFilters filters={filters} onChange={setFilters} />

        {/* ====================================================== */}
        {/* LOADING */}
        {/* ====================================================== */}

        {finesLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-500">Loading fines...</p>
          </div>
        )}

        {/* ====================================================== */}
        {/* ERROR */}
        {/* ====================================================== */}

        {finesError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-700">
              Failed to load fines.
            </p>

            <p className="mt-1 text-sm text-red-600">
              {finesErrorData.message}
            </p>
          </div>
        )}

        {/* ====================================================== */}
        {/* CONTENT */}
        {/* ====================================================== */}

        {!finesLoading && !finesError && finesData && (
          <>
            <FineSummary fines={fines} />

            <FineHistory
              fines={fines}
              canEdit={canEdit}
              onEdit={canEdit ? handleEdit : undefined}
              onCancel={canEdit ? handleCancel : undefined}
            />
          </>
        )}

        {/* ====================================================== */}
        {/* ADD / EDIT MODAL */}
        {/* ====================================================== */}

        <FineModal
          open={showForm}
          onClose={closeForm}
          employeeId={
            editingFine && typeof editingFine.employee === "object"
              ? editingFine.employee._id
              : editingFine && typeof editingFine.employee === "string"
                ? editingFine.employee
                : ""
          }
          fine={editingFine}
        />

        {/* ====================================================== */}
        {/* CANCEL CONFIRMATION */}
        {/* ====================================================== */}

        <FineConfirmModal
          open={Boolean(cancelFine)}
          fine={cancelFine}
          loading={cancelMutation.isPending}
          onConfirm={confirmCancel}
          onClose={() => {
            if (!cancelMutation.isPending) {
              setCancelFine(null);
            }
          }}
        />
      </main>
    </ProtectedRoute>
  );
}
