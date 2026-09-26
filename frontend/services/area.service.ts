import api from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/apiError";

import {
  Area,
  CreateAreaRequest,
  UpdateAreaRequest,
  ReorderAreasRequest,
} from "@/types/area";

// ================= CREATE AREA =================
export const createArea = async (payload: CreateAreaRequest): Promise<Area> => {
  try {
    const response = await api.post("/area", payload);

    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// ================= GET ALL AREAS =================
export const getAreas = async ({
  search,
  isActive,
}: {
  search?: string;
  isActive?: boolean;
} = {}): Promise<Area[]> => {
  try {
    const response = await api.get("/area", {
      params: {
        ...(search && { search }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// ================= GET SINGLE AREA =================
export const getAreaById = async (id: string): Promise<Area> => {
  try {
    const response = await api.get(`/area/${id}`);

    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// ================= UPDATE AREA =================
export const updateArea = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateAreaRequest;
}): Promise<Area> => {
  try {
    const response = await api.patch(`/area/${id}`, payload);

    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// ================= REORDER AREAS =================
export const reorderAreas = async (
  payload: ReorderAreasRequest,
): Promise<void> => {
  try {
    await api.patch("/areas/reorder", payload);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// ================= DELETE AREA =================
export const deleteArea = async (id: string): Promise<void> => {
  try {
    await api.delete(`/area/${id}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};
