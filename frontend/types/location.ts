// types/location.type.ts

export type LocationSector = "zone_1_a" | "zone_1_b" | "zone_1_c" | "zone_1_d";

export interface ILocation {
  _id: string;

  name: string;

  address: string;

  sector: LocationSector;

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
