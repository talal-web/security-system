import {
  EducationLevel,
  EmployeeDesignation,
  EmployeeShift,
  SectorOptions,
} from "@/types/employee";

export type EmployeeFormValues = {
  name: string;
  fatherName: string;
  birthDate: string;
  cnic: string;
  address: string;
  phone1: string;
  phone2: string;
  education?: EducationLevel | "";
  designation: EmployeeDesignation;
  sector?: SectorOptions | "";
  currentLocation?: string;
  defaultShift?: EmployeeShift | "";
  basicSalary?: number;
  reference: string;
  status: "active" | "inactive";
  entryDate: string;
  exitDate: string;
};

export const defaultEmployeeValues: EmployeeFormValues = {
  name: "",
  fatherName: "",
  birthDate: "",
  cnic: "",
  address: "",
  phone1: "",
  phone2: "",
  education: "",
  designation: "guard",
  defaultShift: "",
  sector: "",
  currentLocation: "",
  basicSalary: 0,
  reference: "",
  status: "active",
  entryDate: "",
  exitDate: "",
};
