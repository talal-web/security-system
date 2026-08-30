import {
  EducationLevel,
  EmployeeDesignation,
  EmployeeShift,
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
  sector?: string | "";
  currentLocation?: string;
  defaultShift?: EmployeeShift | "";
  monthlySalary: number;
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
  monthlySalary: 22000,
  reference: "",
  status: "active",
  entryDate: "",
  exitDate: "",
};
