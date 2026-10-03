"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";
import { createEmployee } from "@/services/employee.service";

type Props = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

export function useCreateEmployee({ onSuccess, onError }: Props = {}) {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  const mutation = useMutation({
    mutationFn: (employeeData: FormData) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return createEmployee(employeeData, selectedAreaId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees", selectedAreaId],
      });

      onSuccess?.();
    },

    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while creating employee";

      onError?.(message);
    },
  });

  return {
    handleCreateEmployee: mutation.mutateAsync,

    loading: mutation.isPending,

    isSuccess: mutation.isSuccess,

    isError: mutation.isError,

    success: mutation.isSuccess ? "Employee created successfully" : "",

    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}
