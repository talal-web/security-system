"use client";

import { useState } from "react";
import { toast } from "sonner";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import AdvanceModal from "@/components/advance/AdvanceModal";
import AdvanceConfirmModal from "@/components/advance/AdvanceConfirmModal";
import AdvanceFilters from "@/components/advance/AdvanceFilters";
import AdvanceHistory from "@/components/advance/AdvanceHistory";
import AdvanceSummary from "@/components/advance/AdvanceSummary";
import AdvanceHeader from "@/components/advance/AdvanceHeader";
import { PageContainer } from "@/components/ui/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";

import { useMe } from "@/hooks/auth/useMe";
import { useAdvances, useCancelAdvance } from "@/hooks/advance/useAdvance";

import type {
  Advance,
  AdvanceFilters as AdvanceFilterValues,
} from "@/types/advance";

export default function AdvancesPage() {
  const { data: me } = useMe();

  const userRole = me?.user?.role;

  const canEdit = ["developer", "admin", "clerk"].includes(userRole ?? "");

  const [filters, setFilters] = useState<AdvanceFilterValues>({});

  const [showForm, setShowForm] = useState(false);
  const [editingAdvance, setEditingAdvance] = useState<Advance | null>(null);
  const [cancellingAdvance, setCancellingAdvance] = useState<Advance | null>(
    null,
  );

  const { data, isLoading, isError, error } = useAdvances(filters);

  const cancelMutation = useCancelAdvance();

  const advances = data?.data ?? [];

  const handleAdd = () => {
    setEditingAdvance(null);
    setShowForm(true);
  };

  const handleEdit = (advance: Advance) => {
    setEditingAdvance(advance);
    setShowForm(true);
  };

  const handleCancel = (advance: Advance) => {
    setCancellingAdvance(advance);
  };

  const confirmCancel = () => {
    if (!cancellingAdvance) return;

    cancelMutation.mutate(cancellingAdvance._id, {
      onSuccess: () => toast.success("Advance cancelled successfully."),
      onError: (mutationError) => toast.error(mutationError.message),
      onSettled: () => setCancellingAdvance(null),
    });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAdvance(null);
  };

  return (
    <ProtectedRoute
      allowedRoles={["developer", "admin", "clerk", "supervisor"]}
    >
      <PageContainer>
        <AdvanceHeader
          advances={advances}
          filters={filters}
          canEdit={canEdit}
          onAdd={handleAdd}
        />

        {/* Filters */}
        <AdvanceFilters filters={filters} onChange={setFilters} />

        {/* Loading */}
        {isLoading && <LoadingState title="Loading advances..." />}

        {/* Error */}
        {isError && <ErrorState title={error.message} />}

        {/* Results */}
        {!isLoading && !isError && (
          <>
            <AdvanceSummary advances={advances} />

            {advances.length === 0 ? (
              <EmptyState title="No advance records found." />
            ) : (
              <AdvanceHistory
                advances={advances}
                canEdit={canEdit}
                onEdit={handleEdit}
                onCancel={handleCancel}
              />
            )}
          </>
        )}

        {/* Edit form */}
        {showForm && canEdit && (
          <AdvanceModal
            open
            onClose={closeForm}
            employeeId={
              editingAdvance
                ? typeof editingAdvance.employee === "string"
                  ? editingAdvance.employee
                  : editingAdvance.employee._id
                : ""
            }
            advance={editingAdvance}
          />
        )}

        {/* Cancel confirmation */}
        <AdvanceConfirmModal
          open={Boolean(cancellingAdvance)}
          amount={cancellingAdvance?.amount ?? 0}
          pending={cancelMutation.isPending}
          onConfirm={confirmCancel}
          onClose={() => setCancellingAdvance(null)}
        />
      </PageContainer>
    </ProtectedRoute>
  );
}
