"use client";

import { use, useState } from "react";

import { Plus, WalletCards } from "lucide-react";
import { toast } from "sonner";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { ErrorState, LoadingState } from "@/components/ui/States";
import AdvanceSummary from "@/components/advance/AdvanceSummary";
import AdvanceHistory from "@/components/advance/AdvanceHistory";
import AdvanceModal from "@/components/advance/AdvanceModal";
import AdvanceConfirmModal from "@/components/advance/AdvanceConfirmModal";

import { useMe } from "@/hooks/auth/useMe";
import {
  useEmployeeAdvances,
  useCancelAdvance,
} from "@/hooks/advance/useAdvance";

import type { Advance } from "@/types/advance";

interface EmployeeAdvancesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EmployeeAdvancesPage({
  params,
}: EmployeeAdvancesPageProps) {
  const { id: employeeId } = use(params);
  const { data: me } = useMe();

  const userRole = me?.user?.role;

  const canEdit = ["developer", "admin", "clerk"].includes(userRole ?? "");

  const [showForm, setShowForm] = useState(false);
  const [editingAdvance, setEditingAdvance] = useState<Advance | null>(null);
  const [cancellingAdvance, setCancellingAdvance] = useState<Advance | null>(
    null,
  );

  const { data, isLoading, isError, error } = useEmployeeAdvances(employeeId);

  const cancelAdvance = useCancelAdvance(employeeId);

  const employee = data?.data.employee;
  const advances = data?.data.advances ?? [];

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

    cancelAdvance.mutate(cancellingAdvance._id, {
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
        {isLoading && <LoadingState title="Loading advances..." />}

        {isError && <ErrorState title={error.message} />}

        {!isLoading && !isError && employee && (
          <>
            <PageHeader
              title="Employee Advances"
              description={`${employee.name} · ${employee.empId} · ${employee.designation}`}
              icon={WalletCards}
              actions={
                canEdit && (
                  <Button onClick={handleAdd}>
                    <Plus />
                    Add Advance
                  </Button>
                )
              }
            />

            <AdvanceSummary advances={advances} />

            <AdvanceHistory
              advances={advances}
              canEdit={canEdit}
              onEdit={handleEdit}
              onCancel={handleCancel}
            />
          </>
        )}

        {showForm && canEdit && (
          <AdvanceModal
            open
            onClose={closeForm}
            employeeId={employeeId}
            advance={editingAdvance}
          />
        )}

        <AdvanceConfirmModal
          open={Boolean(cancellingAdvance)}
          amount={cancellingAdvance?.amount ?? 0}
          pending={cancelAdvance.isPending}
          onConfirm={confirmCancel}
          onClose={() => setCancellingAdvance(null)}
        />
      </PageContainer>
    </ProtectedRoute>
  );
}
