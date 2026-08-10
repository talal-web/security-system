// hooks/sector/useSector.ts

"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import {
  createSector,
  deleteSector,
  getSectorById,
  getSectors,
  reorderSectors,
  updateSector,
} from "@/services/sector.service";

import type {
  CreateSectorPayload,
  ReorderSectorPayload,
  SectorQueryParams,
  UpdateSectorPayload,
} from "@/types/sector";

const SECTOR_QUERY_KEY = ["sectors"];

/**
 * Get All Sectors
 */
export function useSectors(params?: SectorQueryParams) {
  return useQuery({
    queryKey: [...SECTOR_QUERY_KEY, params],
    queryFn: () => getSectors(params),

    placeholderData: keepPreviousData,

    staleTime: 30 * 1000,

    refetchOnWindowFocus: false,
  });
}

/**
 * Get Single Sector
 */
export function useSector(id: string) {
  return useQuery({
    queryKey: [...SECTOR_QUERY_KEY, id],
    queryFn: () => getSectorById(id),
    enabled: !!id,
  });
}

/**
 * Create Sector
 */
export function useCreateSector() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSectorPayload) => createSector(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SECTOR_QUERY_KEY,
      });
    },
  });
}

/**
 * Update Sector
 */
export function useUpdateSector() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSectorPayload;
    }) => updateSector(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: SECTOR_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...SECTOR_QUERY_KEY, variables.id],
      });
    },
  });
}

/**
 * Delete Sector
 */
export function useDeleteSector() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSector(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SECTOR_QUERY_KEY,
      });
    },
  });
}

/**
 * Reorder Sectors
 */
export function useReorderSectors() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReorderSectorPayload) => reorderSectors(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SECTOR_QUERY_KEY,
      });
    },
  });
}
