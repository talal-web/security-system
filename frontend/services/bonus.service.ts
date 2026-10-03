import api from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/apiError";

import type {
  BonusFilters,
  BonusResponse,
  BonusesResponse,
  CreateBonusPayload,
  EmployeeBonusesResponse,
  UpdateBonusPayload,
} from "@/types/bonus";

// ============================================================
// Create Bonus
// ============================================================

export async function createBonus(
  bonusData: CreateBonusPayload,
  areaId: string,
): Promise<BonusResponse> {
  try {
    const res = await api.post("/bonuses", { ...bonusData, area: areaId });

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

// ============================================================
// Get Bonuses
// ============================================================

export async function getBonuses(
  filters: BonusFilters = {},
): Promise<BonusesResponse> {
  try {
    const res = await api.get("/bonuses", {
      params: {
        employee: filters.employee,
        status: filters.status,
        search: filters.search,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        area: filters.area,
      },
    });

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

// ============================================================
// Get Employee Bonuses
// ============================================================

export async function getEmployeeBonuses(
  employeeId: string,
  areaId: string,
): Promise<EmployeeBonusesResponse> {
  try {
    const res = await api.get(`/bonuses/employee/${employeeId}`, {
      params: { area: areaId },
    });

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

// ============================================================
// Update Bonus
// ============================================================

export async function updateBonus(
  bonusId: string,
  bonusData: UpdateBonusPayload,
  areaId: string,
): Promise<BonusResponse> {
  try {
    const res = await api.patch(`/bonuses/${bonusId}`, {
      ...bonusData,
      area: areaId,
    });

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

// ============================================================
// Cancel Bonus
// ============================================================

export async function cancelBonus(
  bonusId: string,
  areaId: string,
): Promise<BonusResponse> {
  try {
    const res = await api.patch(`/bonuses/${bonusId}/cancel`, null, {
      params: { area: areaId },
    });

    return res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}
