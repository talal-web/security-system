// types/employee.ts

import { ILocation } from "./location";

export type EmployeeStatus = "active" | "inactive";

export type EmployeeShift = "day" | "night";

export type EducationLevel = "middle" | "matric" | "fsc" | "bs" | "master";

export type SectorOptions =
  | "zone_1_a"
  | "zone_1_b"
  | "zone_1_c"
  | "zone_1_d"
  | "rawalpindi";

export type EmployeeDesignation =
  | "guard"
  | "army_guard"
  | "asst_supervisor"
  | "supervisor"
  | "mcr"
  | "driver"
  | "clerk";

export interface Employee {
  _id: string;
  empId: string;

  name: string;
  fatherName: string;
  birthDate: string;
  age: number;

  cnic: string;
  address: string;

  phone1: string;
  phone2?: string;

  education?: EducationLevel | null;

  designation: EmployeeDesignation;

  reference?: string;

  sector?: SectorOptions | null;

  currentLocation?: string | ILocation | null;

  basicSalary: number;

  status: EmployeeStatus;

  defaultShift?: EmployeeShift | null;

  entryDate: string;

  exitDate?: string | null;

  profileImage?: string;

  cnicFrontImage?: string;

  cnicBackImage?: string;

  notes?: string;

  createdAt: string;

  updatedAt: string;
}

export interface EmployeeFilters {
  status?: EmployeeStatus;

  designation?: EmployeeDesignation;

  sector?: SectorOptions;

  education?: EducationLevel;

  defaultShift?: EmployeeShift;

  search?: string;

  entryFrom?: string;

  entryTo?: string;

  hasExited?: boolean;

  basicSalary?: number;
}
