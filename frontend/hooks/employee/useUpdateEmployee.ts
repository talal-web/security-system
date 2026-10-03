"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";
import { updateEmployee } from "@/services/employee.service";

type UpdateEmployeeParams = {
  id: string;
  employeeData: FormData;
};

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  const mutation = useMutation({
    mutationFn: ({ id, employeeData }: UpdateEmployeeParams) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return updateEmployee(id, employeeData, selectedAreaId);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["employees", selectedAreaId],
      });

      queryClient.invalidateQueries({
        queryKey: ["employee", variables.id, selectedAreaId],
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
