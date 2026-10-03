// services/location.service.ts

import api from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/apiError";

import {
  ILocation,
  CreateLocationPayload,
  UpdateLocationPayload,
  ReorderLocationsPayload,
  LocationSectorId,
} from "@/types/location";

// ================= CREATE LOCATION =================
export const createLocation = async (
  payload: CreateLocationPayload,
  areaId: string,
): Promise<ILocation> => {
  try {
    const response = await api.post(
      "/locations",
      { ...payload, area: areaId },
      { params: { area: areaId } },
    );

    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// ================= GET ALL LOCATIONS =================
export const getLocations = async (
  filters: {
    search?: string;
    sector?: LocationSectorId;
    isActive?: boolean;
  },
  areaId: string,
): Promise<ILocation[]> => {
  try {
    const { search, sector, isActive } = filters;
    const response = await api.get("/locations", {
      params: {
        ...(search && { search }),
        ...(sector && { sector }),
        area: areaId,
        ...(isActive !== undefined && { isActive }),
      },
    });

    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// ================= GET SINGLE LOCATION =================
export const getLocationById = async (
  id: string,
  areaId: string,
): Promise<ILocation> => {
  try {
    const response = await api.get(`/locations/${id}`, {
      params: { area: areaId },
    });

    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// ================= UPDATE LOCATION =================
export const updateLocation = async ({
  id,
  payload,
  areaId,
}: {
  id: string;
  payload: UpdateLocationPayload;
  areaId: string;
}): Promise<ILocation> => {
  try {
    const response = await api.put(
      `/locations/${id}`,
      { ...payload, area: areaId },
      { params: { area: areaId } },
    );

    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// ================= REORDER LOCATIONS =================
export const reorderLocations = async (
  payload: ReorderLocationsPayload,
  areaId: string,
): Promise<void> => {
  try {
    await api.patch("/locations/reorder", payload, {
      params: { area: areaId },
    });
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// ================= DELETE LOCATION =================
export const deleteLocation = async (
  id: string,
  areaId: string,
): Promise<void> => {
  try {
    await api.delete(`/locations/${id}`, {
      params: { area: areaId },
    });
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};
