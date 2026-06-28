"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteLocation } from "@/services/location.service";

type Props = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

export function useDeleteLocation({ onSuccess, onError }: Props = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteLocation(id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });

      onSuccess?.();
    },

    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to delete location";

      onError?.(message);
    },
  });

  return {
    removeLocation: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}
