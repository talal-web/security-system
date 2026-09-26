"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import {
  createArea,
  deleteArea,
  getAreaById,
  getAreas,
  reorderAreas,
  updateArea,
} from "@/services/area.service";

import type {
  Area,
  CreateAreaRequest,
  ReorderAreasRequest,
  UpdateAreaRequest,
} from "@/types/area";

const AREA_QUERY_KEY = ["areas"];

/**
 * Get All Areas
 */
export function useAreas(params?: { search?: string; isActive?: boolean }) {
  return useQuery<Area[]>({
    queryKey: [...AREA_QUERY_KEY, params],
    queryFn: () => getAreas(params),

    placeholderData: keepPreviousData,

    staleTime: 30 * 1000,

    refetchOnWindowFocus: false,
  });
}

/**
 * Get Single Area
 */
export function useArea(id: string) {
  return useQuery({
    queryKey: [...AREA_QUERY_KEY, id],
    queryFn: () => getAreaById(id),
    enabled: !!id,
  });
}

/**
 * Create Area
 */
export function useCreateArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAreaRequest) => createArea(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: AREA_QUERY_KEY,
      });
    },
  });
}

/**
 * Update Area
 */
export function useUpdateArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAreaRequest }) =>
      updateArea({ id, payload }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: AREA_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...AREA_QUERY_KEY, variables.id],
      });
    },
  });
}

/**
 * Delete Area
 */
export function useDeleteArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteArea(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: AREA_QUERY_KEY,
      });
    },
  });
}

/**
 * Reorder Areas
 */
export function useReorderAreas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReorderAreasRequest) => reorderAreas(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: AREA_QUERY_KEY,
      });
    },
  });
}
