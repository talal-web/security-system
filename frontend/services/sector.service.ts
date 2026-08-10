import api from "@/lib/axios";

import type {
  CreateSectorPayload,
  UpdateSectorPayload,
  SectorQueryParams,
  ReorderSectorPayload,
  SectorResponse,
  SectorsResponse,
} from "@/types/sector";

const BASE_URL = "/sectors";

/**
 * Get All Sectors
 */
export const getSectors = async (
  params?: SectorQueryParams,
): Promise<SectorsResponse> => {
  const { data } = await api.get(BASE_URL, {
    params,
  });

  return data;
};

/**
 * Get Sector By Id
 */
export const getSectorById = async (id: string): Promise<SectorResponse> => {
  const { data } = await api.get(`${BASE_URL}/${id}`);

  return data;
};

/**
 * Create Sector
 */
export const createSector = async (
  payload: CreateSectorPayload,
): Promise<SectorResponse> => {
  const { data } = await api.post(BASE_URL, payload);

  return data;
};

/**
 * Update Sector
 */
export const updateSector = async (
  id: string,
  payload: UpdateSectorPayload,
): Promise<SectorResponse> => {
  const { data } = await api.patch(`${BASE_URL}/${id}`, payload);

  return data;
};

/**
 * Delete Sector
 */
export const deleteSector = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete(`${BASE_URL}/${id}`);

  return data;
};

/**
 * Reorder Sectors
 */
export const reorderSectors = async (
  payload: ReorderSectorPayload,
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.patch(`${BASE_URL}/reorder`, payload);

  return data;
};
