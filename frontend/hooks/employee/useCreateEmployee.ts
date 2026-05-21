// src/hooks/useCreateEmployee.ts

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Employee } from "@/types/employee";

import { createEmployee } from "@/services/employee.service";

type Props = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

export function useCreateEmployee({ onSuccess, onError }: Props = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (employeeData: FormData) => {
      const data = Object.fromEntries(
        employeeData.entries(),
      ) as Partial<Employee>;

      return await createEmployee(data);
    },

    onSuccess: () => {
      // Refresh employee list
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      onSuccess?.();
    },

    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while creating employee";

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
