// src/hooks/useDeleteEmployee.ts

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteEmployee } from "@/services/employeeService";

type Props = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

export function useDeleteEmployee({ onSuccess, onError }: Props = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (employeeId: string) => {
      return await deleteEmployee(employeeId);
    },

    onSuccess: () => {
      // Refresh employee list
      queryClient.invalidateQueries({
        queryKey: ["employees"],
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
