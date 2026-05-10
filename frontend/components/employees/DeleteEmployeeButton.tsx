// src/components/employees/DeleteEmployeeButton.tsx

"use client";

import { Trash2, Loader2 } from "lucide-react";

import { useDeleteEmployee } from "@/hooks/useDeleteEmployee";

type Props = {
  employeeId: string;
  onDeleted?: () => void;
};

export default function DeleteEmployeeButton({ employeeId, onDeleted }: Props) {
  const { removeEmployee, isLoading } = useDeleteEmployee({
    onSuccess: () => {
      alert("Employee deleted successfully");

      onDeleted?.();
    },

    onError: (message) => {
      alert(message);
    },
  });

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?",
    );

    if (!confirmed) return;

    removeEmployee(employeeId);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className="
        inline-flex items-center gap-2
        rounded-xl bg-red-600 px-4 py-2
        text-sm font-medium text-white
        transition hover:bg-red-700
        disabled:cursor-not-allowed
        disabled:opacity-70
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
          Delete
        </>
      )}
    </button>
  );
}
