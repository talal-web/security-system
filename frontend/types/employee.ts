// types/employee.ts

import { ILocation } from "./location";

export type EmployeeStatus = "active" | "inactive";

export type EducationLevel =
  | "nil"
  | "middle"
  | "matric"
  | "fsc"
  | "intermediate"
  | "bs"
  | "master";

export type SectorOptions = "zone_1_a" | "zone_1_b" | "zone_1_c" | "zone_1_d";

export type EmployeeDesignation =
  | "guard"
  | "army guard"
  | "asst supervisor"
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

  education: EducationLevel;
  designation: EmployeeDesignation;

  reference?: string;
  sector: SectorOptions;
  currentLocation: string | ILocation;

  basicSalary: number;
  status: EmployeeStatus;

  entryDate: string;
  exitDate?: string | null;

  profileImage?: string;
  cnicFrontImage?: string;
  cnicBackImage?: string;

  notes?: string;

  createdAt: string;
  updatedAt: string;
}
