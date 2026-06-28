// hooks/location/useReorderLocations.ts

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { reorderLocations } from "@/services/location.service";
import { ReorderLocationsPayload } from "@/types/location";

export const useReorderLocations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReorderLocationsPayload) => reorderLocations(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });

      toast.success("Locations reordered successfully.");
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
