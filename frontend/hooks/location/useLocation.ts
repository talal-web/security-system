// hooks/location/useLocation.ts

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";
import {
  createLocation,
  deleteLocation,
  getLocationById,
  getLocations,
  updateLocation,
} from "@/services/location.service";

import {
  CreateLocationPayload,
  UpdateLocationPayload,
  LocationSectorId,
} from "@/types/location";

// ================= GET ALL LOCATIONS =================
export const useLocations = ({
  search,
  sector,
  isActive,
  enabled,
}: {
  search?: string;
  sector?: LocationSectorId;
  isActive?: boolean;
  enabled?: boolean;
} = {}) => {
  const { selectedAreaId } = useSelectedArea();
  const effectiveArea = selectedAreaId ?? undefined;

  return useQuery({
    queryKey: ["locations", effectiveArea, search, sector, isActive],

    queryFn: () =>
      getLocations({
        search,
        sector,
        isActive,
      }, selectedAreaId!),

    enabled: Boolean(selectedAreaId) && (enabled ?? true),
    staleTime: 60 * 1000,
  });
};

// ================= GET SINGLE LOCATION =================
export const useLocation = (id: string) => {
  const { selectedAreaId } = useSelectedArea();

  return useQuery({
    queryKey: ["location", selectedAreaId ?? "", id],

    queryFn: () => getLocationById(id, selectedAreaId!),

    enabled: Boolean(id && selectedAreaId),
  });
};

// ================= CREATE LOCATION =================
export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (payload: CreateLocationPayload) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return createLocation(payload, selectedAreaId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });
    },
  });
};

// ================= UPDATE LOCATION =================
export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateLocationPayload;
    }) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return updateLocation({ id, payload, areaId: selectedAreaId });
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });

      queryClient.invalidateQueries({
        queryKey: ["location", selectedAreaId!, variables.id],
      });
    },
  });
};

// ================= DELETE LOCATION =================
export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (id: string) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return deleteLocation(id, selectedAreaId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });
    },
  });
};
