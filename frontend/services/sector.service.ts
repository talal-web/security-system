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
  params: SectorQueryParams | undefined,
  areaId: string,
): Promise<SectorsResponse> => {
  const { data } = await api.get(BASE_URL, {
    params: { ...params, area: areaId },
  });

  return data;
};

/**
 * Get Sector By Id
 */
export const getSectorById = async (
  id: string,
  areaId: string,
): Promise<SectorResponse> => {
  const { data } = await api.get(`${BASE_URL}/${id}`, {
    params: { area: areaId },
  });

  return data;
};

/**
 * Create Sector
 */
export const createSector = async (
  payload: CreateSectorPayload,
  areaId: string,
): Promise<SectorResponse> => {
  const { data } = await api.post(
    BASE_URL,
    { ...payload, area: areaId },
    { params: { area: areaId } },
  );

  return data;
};

/**
 * Update Sector
 */
export const updateSector = async (
  id: string,
  payload: UpdateSectorPayload,
  areaId: string,
): Promise<SectorResponse> => {
  const { data } = await api.patch(
    `${BASE_URL}/${id}`,
    { ...payload, area: areaId },
    { params: { area: areaId } },
  );

  return data;
};

/**
 * Delete Sector
 */
export const deleteSector = async (
  id: string,
  areaId: string,
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete(`${BASE_URL}/${id}`, {
    params: { area: areaId },
  });

  return data;
};

/**
 * Reorder Sectors
 */
export const reorderSectors = async (
  payload: ReorderSectorPayload,
  areaId: string,
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.patch(`${BASE_URL}/reorder`, payload, {
    params: { area: areaId },
  });

  return data;
};
