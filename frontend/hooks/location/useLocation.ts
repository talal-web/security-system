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

import { CreateLocationPayload, UpdateLocationPayload } from "@/types/location";

// ================= GET ALL LOCATIONS =================
export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],

    queryFn: getLocations,
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
