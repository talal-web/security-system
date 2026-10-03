// hooks/location/useReorderLocations.ts

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useSelectedArea } from "@/components/area/AreaContext";
import { reorderLocations } from "@/services/location.service";
import { ReorderLocationsPayload } from "@/types/location";

export const useReorderLocations = () => {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (payload: ReorderLocationsPayload) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return reorderLocations(payload, selectedAreaId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });

      toast.success("Locations reordered successfully.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to reorder locations.");
    },
  });
};
