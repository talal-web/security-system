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
  emergencyContacts: {
    name: string;
    relation: string;
    contact: string;
    address: string;
    isPrimary: boolean;
  }[];
  references: {
    name: string;
    relation: string;
    contact: string;
    address: string;
  }[];
  education?: EducationLevel | "";
  designation: EmployeeDesignation;
  area?: string | "";
  sector?: string | "";
  currentLocation?: string;
  defaultShift?: EmployeeShift | "";
  monthlySalary: number;
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
  emergencyContacts: [],
  references: [],
  education: "",
  designation: "guard",
  defaultShift: "",
  area: "",
  sector: "",
  currentLocation: "",
  monthlySalary: 22000,
  status: "active",
  entryDate: "",
  exitDate: "",
};
