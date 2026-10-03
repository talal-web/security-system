// hooks/sector/useSector.ts

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";
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

const SECTOR_QUERY_KEY = ["sectors"] as const;

/**
 * Get All Sectors
 *
 * Supports filtering by:
 * - Area
 * - Active status
 * - Other SectorQueryParams supported by the API
 */
export function useSectors(
  params?: SectorQueryParams,
  options?: { enabled?: boolean },
) {
  const { selectedAreaId } = useSelectedArea();

  const effectiveParams = { ...params, area: selectedAreaId ?? undefined };

  return useQuery({
    queryKey: [...SECTOR_QUERY_KEY, effectiveParams ?? {}],
    queryFn: () => getSectors(effectiveParams, selectedAreaId!),
    enabled: Boolean(selectedAreaId) && (options?.enabled ?? true),

    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
}

/**
 * Get Single Sector
 */
export function useSector(id: string) {
  const { selectedAreaId } = useSelectedArea();

  return useQuery({
    queryKey: [...SECTOR_QUERY_KEY, "detail", selectedAreaId ?? "", id],
    queryFn: () => getSectorById(id, selectedAreaId!),
    enabled: Boolean(id && selectedAreaId),
  });
}

/**
 * Create Sector
 */
export function useCreateSector() {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (payload: CreateSectorPayload) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return createSector(payload, selectedAreaId);
    },

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
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSectorPayload;
    }) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return updateSector(id, payload, selectedAreaId);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: SECTOR_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [
          ...SECTOR_QUERY_KEY,
          "detail",
          selectedAreaId!,
          variables.id,
        ],
      });
    },
  });
}

/**
 * Delete Sector
 */
export function useDeleteSector() {
  const queryClient = useQueryClient();
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (id: string) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return deleteSector(id, selectedAreaId);
    },

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
  const { selectedAreaId } = useSelectedArea();

  return useMutation({
    mutationFn: (payload: ReorderSectorPayload) => {
      if (!selectedAreaId) throw new Error("No area is selected.");
      return reorderSectors(payload, selectedAreaId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SECTOR_QUERY_KEY,
      });
    },
  });
}
