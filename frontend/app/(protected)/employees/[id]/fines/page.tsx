"use client";

import { use, useState } from "react";
import { Plus } from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
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
      <main className="space-y-6 p-4 sm:p-6">
        {isLoading && (
          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-gray-500">Loading fines...</p>
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-700">{error.message}</p>
          </div>
        )}

        {!isLoading && !isError && employee && (
          <>
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  Employee Fines
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  {employee.name} · {employee.empId} · {employee.designation}
                </p>
              </div>

              {canEdit && (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add Fine
                </button>
              )}
            </header>

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
      </main>
    </ProtectedRoute>
  );
}
