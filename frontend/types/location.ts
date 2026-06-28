// types/location.type.ts

export type LocationSector =
  | "zone_1_a"
  | "zone_1_b"
  | "zone_1_c"
  | "zone_1_d"
  | "rawalpindi";

export interface ILocation {
  _id: string;

  name: string;

  address: string;

  sector: LocationSector;

  sortOrder: number;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface CreateLocationPayload {
  name: string;

  address?: string;

  sector: LocationSector;
}

export interface UpdateLocationPayload {
  name?: string;

  address?: string;

  sector?: LocationSector;

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
  sector: LocationSector;

  locations: ReorderLocationItem[];
}
