// types/location.type.ts

import type { Sector } from "@/types/sector";

export type LocationSectorId = string;

export type LocationSectorSummary = Pick<
  Sector,
  "_id" | "name" | "code" | "sortOrder" | "isActive"
>;

export interface ILocation {
  _id: string;

  name: string;

  address: string;

  sector: LocationSectorSummary;

  sortOrder: number;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface CreateLocationPayload {
  name: string;

  address?: string;

  sector: LocationSectorId;
}

export interface UpdateLocationPayload {
  name?: string;

  address?: string;

  sector?: LocationSectorId;

  isActive?: boolean;
}

/**
 * Single location reorder item
 */
export interface ReorderLocationItem {
  _id: string;

  sortOrder: number;
}

/**
 * Payload for drag & drop reorder API
 */
export interface ReorderLocationsPayload {
  sector: LocationSectorId;

  locations: ReorderLocationItem[];
}
