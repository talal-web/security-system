// services/location.service.ts

import api from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/apiError";

import {
  ILocation,
  CreateLocationPayload,
  UpdateLocationPayload,
  LocationSector,
} from "@/types/location";

// ================= CREATE LOCATION =================
export const createLocation = async (
  payload: CreateLocationPayload,
): Promise<ILocation> => {
  try {
    const response = await api.post("/locations", payload);

    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// ================= GET ALL LOCATIONS =================
export const getLocations = async ({
  search,
  sector,
  isActive,
}: {
  search?: string;
  sector?: LocationSector;
  isActive?: boolean;
} = {}): Promise<ILocation[]> => {
  try {
    const response = await api.get("/locations", {
      params: {
        ...(search && { search }),
        ...(sector && { sector }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// ================= GET SINGLE LOCATION =================
export const getLocationById = async (id: string): Promise<ILocation> => {
  try {
    const response = await api.get(`/locations/${id}`);

    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// ================= UPDATE LOCATION =================
export const updateLocation = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateLocationPayload;
}): Promise<ILocation> => {
  try {
    const response = await api.put(`/locations/${id}`, payload);

    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// ================= DELETE LOCATION =================
export const deleteLocation = async (id: string): Promise<void> => {
  try {
    await api.delete(`/locations/${id}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};
