export interface Area {
  _id: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAreaRequest {
  name: string;
  description?: string;
}

export interface UpdateAreaRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface ReorderAreaItem {
  _id: string;
  sortOrder: number;
}

export interface ReorderAreasRequest {
  areas: ReorderAreaItem[];
}

export interface AreaResponse {
  success: boolean;
  message?: string;
  data: Area;
}

export interface AreasResponse {
  success: boolean;
  count: number;
  data: Area[];
}
