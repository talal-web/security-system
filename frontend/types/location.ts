// types/location.type.ts

export interface ILocation {
  _id: string;

  name: string;

  address?: string;

  sector?: string;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface CreateLocationPayload {
  name: string;

  address?: string;

  sector?: string;
}

export interface UpdateLocationPayload {
  name?: string;

  address?: string;

  sector?: string;

  isActive?: boolean;
}
