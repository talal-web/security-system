// types/employee.ts

import { ILocation } from "./location";

import { Sector } from "./sector";

export type EmployeeStatus = "active" | "inactive";

export type EmployeeShift = "day" | "night";

export type EducationLevel =
  | "none"
  | "middle"
  | "matric"
  | "fsc"
  | "bs"
  | "master";

export type SectorOptions = Sector;

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

export interface EmployeeLookupResult {
  _id: string;
  empId: string;
  name: string;
  fatherName: string;
  designation: string;
  status: EmployeeStatus;
}

export interface EmployeeFilters {
  status?: EmployeeStatus;

  designation?: EmployeeDesignation;

  sector?: string;

  education?: EducationLevel;

  defaultShift?: EmployeeShift;

  unassigned?: "" | "sector" | "shift" | "currentLocation";

  search?: string;

  entryFrom?: string;

  entryTo?: string;

  hasExited?: boolean;
}
