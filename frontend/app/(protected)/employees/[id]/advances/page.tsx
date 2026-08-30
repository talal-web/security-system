"use client";

import { use, useState } from "react";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
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
      <main className="space-y-6 p-6">
        {isLoading && (
          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-500">Loading advances...</p>
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
        )}

        {!isLoading && !isError && employee && (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Employee Advances
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  {employee.name} · {employee.empId} · {employee.designation}
                </p>
              </div>

              {canEdit && (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Advance
                </button>
              )}
            </div>

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
      </main>
    </ProtectedRoute>
  );
}
