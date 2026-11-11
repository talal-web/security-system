"use client";

import { use, useState } from "react";
import { Gavel, Plus } from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { ErrorState, LoadingState } from "@/components/ui/States";
import FineSummary from "@/components/fine/FineSummary";
import FineHistory from "@/components/fine/FineHistory";
import FineModal from "@/components/fine/FineModal";
import FineConfirmModal from "@/components/fine/FineConfirmModal";

import { useMe } from "@/hooks/auth/useMe";
import { useEmployeeFines, useCancelFine } from "@/hooks/fine/useFine";

import type { Fine } from "@/types/fine";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EmployeeFinesPage({ params }: PageProps) {
  const { id: employeeId } = use(params);
  const { data: me } = useMe();

  const canEdit = ["developer", "admin", "clerk"].includes(
    me?.user?.role ?? "",
  );

  const { data, isLoading, isError, error } = useEmployeeFines(employeeId);

  const cancelMutation = useCancelFine(employeeId);

  const [formOpen, setFormOpen] = useState(false);
  const [editingFine, setEditingFine] = useState<Fine | null>(null);
  const [cancelFine, setCancelFine] = useState<Fine | null>(null);

  const employee = data?.data.employee;
  const fines = data?.data.fines ?? [];

  const closeForm = () => {
    setFormOpen(false);
    setEditingFine(null);
  };

  const handleAdd = () => {
    setEditingFine(null);
    setFormOpen(true);
  };

  const handleEdit = (fine: Fine) => {
    setEditingFine(fine);
    setFormOpen(true);
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

  return (
    <ProtectedRoute
      allowedRoles={["developer", "admin", "clerk", "supervisor"]}
    >
      <PageContainer>
        {isLoading && <LoadingState title="Loading fines..." />}

        {isError && <ErrorState title={error.message} />}

        {!isLoading && !isError && employee && (
          <>
            <PageHeader
              title="Employee Fines"
              description={`${employee.name} · ${employee.empId} · ${employee.designation}`}
              icon={Gavel}
              actions={
                canEdit && (
                  <Button onClick={handleAdd}>
                    <Plus />
                    Add Fine
                  </Button>
                )
              }
            />

            <FineSummary fines={fines} />

            <FineHistory
              fines={fines}
              canEdit={canEdit}
              onEdit={canEdit ? handleEdit : undefined}
              onCancel={canEdit ? handleCancel : undefined}
            />
          </>
        )}

        <FineModal
          open={formOpen}
          onClose={closeForm}
          employeeId={employeeId}
          fine={editingFine}
        />

        <FineConfirmModal
          open={Boolean(cancelFine)}
          fine={cancelFine}
          loading={cancelMutation.isPending}
          onConfirm={confirmCancel}
          onClose={() => setCancelFine(null)}
        />
      </PageContainer>
    </ProtectedRoute>
  );
}
