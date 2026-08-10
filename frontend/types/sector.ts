export interface Sector {
  _id: string;
  name: string;
  code: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSectorPayload {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateSectorPayload {
  name?: string;
  code?: string;
  description?: string;
  isActive?: boolean;
}

export interface SectorQueryParams {
  search?: string;
  isActive?: boolean;
}

export interface ReorderSectorPayload {
  sectors: {
    _id: string;
    sortOrder: number;
  }[];
}

export interface SectorResponse {
  success: boolean;
  data: Sector;
  message?: string;
}

export interface SectorsResponse {
  success: boolean;
  count: number;
  data: Sector[];
}
