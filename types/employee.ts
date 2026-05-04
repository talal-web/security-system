// types/employee.ts

// ======================
// Status
// ======================

export type EmployeeStatus = "active" | "inactive";

// ======================
// Education
// ======================

export type EducationLevel =
  | "nil"
  | "middle"
  | "matric"
  | "fsc"
  | "intermediate"
  | "bs"
  | "master";

// ======================
// Designation
// ======================

export type EmployeeDesignation =
  | "guard"
  | "army guard"
  | "asst supervisor"
  | "supervisor"
  | "mcr"
  | "driver"
  | "clerk";

// ======================
// Employee Interface
// ======================

export interface Employee {
  _id: string;

  // Personal Information
  name: string;
  fatherName: string;
  age: number;
  cnic: string;
  address: string;

  // Contact
  phone1: string;
  phone2?: string;

  // Education & Job
  education: EducationLevel;
  designation: EmployeeDesignation;

  // Reference
  reference?: string;

  // Status
  status: EmployeeStatus;

  // Dates
  entryDate: string;
  exitDate?: string | null;

  // Images
  profileImage?: string;
  cnicFrontImage?: string;
  cnicBackImage?: string;

  // Extra
  notes?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}
