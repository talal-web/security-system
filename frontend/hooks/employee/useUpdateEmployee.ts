// hooks/useUpdateEmployee.ts

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateEmployee } from "@/services/employee.service";
import { Employee } from "@/types/employee";

type UpdateEmployeeParams = {
  id: string;
  employeeData: FormData | Partial<Employee>;
};

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, employeeData }: UpdateEmployeeParams) => {
      return updateEmployee(id, employeeData);
    },

    onSuccess: () => {
      // refresh employee list after update
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });

  return {
    // main function (use this in form)
    handleUpdateEmployee: mutation.mutateAsync,

    // states
    loading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,

    // optional helpers
    reset: mutation.reset,
  };
}
