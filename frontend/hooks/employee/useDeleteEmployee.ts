// src/hooks/useDeleteEmployee.ts

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";
import { deleteEmployee } from "@/services/employee.service";

type Props = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

export function useDeleteEmployee({ onSuccess, onError }: Props = {}) {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  const mutation = useMutation({
    mutationFn: async (employeeId: string) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return await deleteEmployee(employeeId, selectedAreaId);
    },

    onSuccess: () => {
      // Refresh employee list
      queryClient.invalidateQueries({
        queryKey: ["employees", selectedAreaId],
      });

      onSuccess?.();
    },

    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to delete employee";

      onError?.(message);
    },
  });

  return {
    removeEmployee: mutation.mutateAsync,

    isLoading: mutation.isPending,

    isError: mutation.isError,

    isSuccess: mutation.isSuccess,

    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}
