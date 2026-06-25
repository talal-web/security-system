"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateEmployee } from "@/services/employee.service";

type UpdateEmployeeParams = {
  id: string;
  employeeData: FormData;
};

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, employeeData }: UpdateEmployeeParams) =>
      updateEmployee(id, employeeData),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employee", variables.id],
      });
    },
  });

  return {
    handleUpdateEmployee: mutation.mutateAsync,

    loading: mutation.isPending,

    isError: mutation.isError,

    error: mutation.error instanceof Error ? mutation.error.message : null,

    isSuccess: mutation.isSuccess,

    reset: mutation.reset,
  };
}
