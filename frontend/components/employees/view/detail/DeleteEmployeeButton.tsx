"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Button } from "@/components/ui/Button";
import { useSelectedArea } from "@/components/area/AreaContext";
import { useDeleteEmployee } from "@/hooks/employee/useDeleteEmployee";

type Props = {
  employeeId: string;
};

export default function DeleteEmployeeButton({ employeeId }: Props) {
  const router = useRouter();
  const { selectedAreaId, getAreaAwareHref } = useSelectedArea();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { removeEmployee, isLoading } = useDeleteEmployee({
    onSuccess: () => {
      toast.success("Employee deleted successfully.");
      router.push(getAreaAwareHref("/employees"));
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
      <Button
        variant="danger-soft"
        onClick={() => setConfirmOpen(true)}
        disabled={isLoading || !selectedAreaId}
        className="w-full sm:w-auto"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            Deleting...
          </>
        ) : (
          <>
            <Trash2 />
            Delete Employee
          </>
        )}
      </Button>

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
