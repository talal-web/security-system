// hooks/location/useLocation.ts

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  LocationSector,
} from "@/types/location";

// ================= GET ALL LOCATIONS =================
export const useLocations = ({
  search,
  sector,
  isActive,
  enabled,
}: {
  search?: string;
  sector?: LocationSector;
  isActive?: boolean;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: ["locations", search, sector, isActive],

    queryFn: () =>
      getLocations({
        search,
        sector,
        isActive,
      }),

    enabled: enabled ?? true,
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

// ================= GET SINGLE LOCATION =================
export const useLocation = (id: string) => {
  return useQuery({
    queryKey: ["location", id],

    queryFn: () => getLocationById(id),

    enabled: !!id,
  });
};

// ================= CREATE LOCATION =================
export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLocationPayload) => createLocation(payload),

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

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateLocationPayload;
    }) => updateLocation({ id, payload }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });

      queryClient.invalidateQueries({
        queryKey: ["location", variables.id],
      });
    },
  });
};

// ================= DELETE LOCATION =================
export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLocation(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });
    },
  });
};
