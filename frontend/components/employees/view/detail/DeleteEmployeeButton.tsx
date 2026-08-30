"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useDeleteEmployee } from "@/hooks/employee/useDeleteEmployee";

type Props = {
  employeeId: string;
};

export default function DeleteEmployeeButton({ employeeId }: Props) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { removeEmployee, isLoading } = useDeleteEmployee({
    onSuccess: () => {
      toast.success("Employee deleted successfully.");
      router.push("/employees");
    },

    onError: (message) => {
      toast.error(message || "Failed to delete employee.");
    },
  });

  const handleConfirmDelete = () => {
    removeEmployee(employeeId).catch(() => {
      // errors are already surfaced via the onError toast above
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={isLoading}
        className="
          inline-flex h-9 w-full items-center justify-center gap-1.5
          rounded-lg border border-red-200 bg-red-50 px-3
          text-xs font-semibold text-red-700
          transition-colors duration-200
          hover:bg-red-100
          disabled:cursor-not-allowed
          disabled:opacity-70
          sm:w-auto
        "
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Deleting...
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4" />
            Delete Employee
          </>
        )}
      </button>

      <ConfirmationModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
        title="Delete employee?"
        description="This permanently removes this employee's record and cannot be undone."
        confirmText="Delete employee"
      />
    </>
  );
}
