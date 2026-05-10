// src/hooks/useDeleteEmployee.ts

"use client";

import { useEffect, useState } from "react";

import { deleteEmployee } from "@/services/employeeService";

type Props = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

export function useDeleteEmployee({ onSuccess, onError }: Props = {}) {
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const removeEmployee = (id: string) => {
    setEmployeeId(id);
  };

  useEffect(() => {
    if (!employeeId) return;

    const handleDelete = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await deleteEmployee(employeeId);

        onSuccess?.();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete employee";

        setError(message);

        onError?.(message);
      } finally {
        setIsLoading(false);
        setEmployeeId(null);
      }
    };

    handleDelete();
  }, [employeeId, onSuccess, onError]);

  return {
    removeEmployee,
    isLoading,
    error,
  };
}
