// http/validators/employeeSchemas.js
//
// Request-shape validation for the employee routes. This only checks that
// the request is well-formed (required fields present, correct types,
// known enum values, basic cross-field rules). It does NOT check anything
// that requires database state (CNIC uniqueness, area/sector/location
// existence or area-scope access) - those remain business rules owned by
// EmployeeService.

import { z } from "zod";

import { optionalObjectId } from "./common.js";

const DESIGNATIONS = [
  "guard",
  "army_guard",
  "asst_supervisor",
  "supervisor",
  "mcr",
  "driver",
  "clerk",
];

const EDUCATION_LEVELS = ["none", "middle", "matric", "fsc", "bs", "master"];
const SHIFTS = ["day", "night"];
const STATUSES = ["active", "inactive"];

const optionalEnum = (values) =>
  z.union([z.enum(values), z.literal("")]).optional();

const requiredText = (message) => z.string().trim().min(1, message);

// ======================================
// CREATE
// ======================================

export const createEmployeeSchema = z
  .object({
    name: requiredText("Name is required"),
    fatherName: requiredText("Father name is required"),
    birthDate: z.coerce.date({ message: "A valid birth date is required" }),
    cnic: requiredText("CNIC is required"),
    address: requiredText("Address is required"),
    phone1: requiredText("Phone number is required"),
    designation: z.enum(DESIGNATIONS, {
      message: "A valid designation is required",
    }),

    education: optionalEnum(EDUCATION_LEVELS),
    status: z.enum(STATUSES).optional(),
    defaultShift: optionalEnum(SHIFTS),

    entryDate: z.coerce.date().optional(),
    exitDate: z.coerce.date().optional(),

    monthlySalary: z.coerce
      .number({ message: "A valid monthlySalary is required" })
      .min(0, "monthlySalary cannot be negative"),

    area: optionalObjectId("Invalid area ID"),
    sector: optionalObjectId("Invalid sector ID"),
    currentLocation: optionalObjectId("Invalid current location ID"),

    notes: z.string().optional(),
  })
  // emergencyContacts, references, and anything else are normalized and
  // validated by EmployeeService itself; let them pass through untouched.
  .loose()
  .superRefine((data, ctx) => {
    const effectiveStatus = data.status || "active";

    if (effectiveStatus === "active") {
      if (!data.entryDate) {
        ctx.addIssue({
          code: "custom",
          path: ["entryDate"],
          message: "Entry date is required for active employees",
        });
      }

      if (data.exitDate) {
        ctx.addIssue({
          code: "custom",
          path: ["exitDate"],
          message: "Active employees cannot have an exit date",
        });
      }
    }

    if (data.entryDate && data.exitDate && data.exitDate < data.entryDate) {
      ctx.addIssue({
        code: "custom",
        path: ["exitDate"],
        message: "Exit date cannot be earlier than entry date",
      });
    }
  });

// ======================================
// UPDATE
// ======================================
//
// Every field is optional (partial update). Only format/enum validity is
// checked here - EmployeeService.updateEmployeeService already decides
// which fields are nullable ("" -> null) and which require DB lookups.

export const updateEmployeeSchema = z
  .object({
    name: requiredText("Name cannot be empty").optional(),
    fatherName: requiredText("Father name cannot be empty").optional(),
    birthDate: z.coerce.date({ message: "Invalid birth date" }).optional(),
    cnic: requiredText("CNIC cannot be empty").optional(),
    address: requiredText("Address cannot be empty").optional(),
    phone1: requiredText("Phone number cannot be empty").optional(),
    designation: z.enum(DESIGNATIONS).optional(),

    education: optionalEnum(EDUCATION_LEVELS),
    status: z.enum(STATUSES).optional(),
    defaultShift: optionalEnum(SHIFTS),

    exitDate: z.union([z.coerce.date(), z.literal("")]).optional(),

    area: optionalObjectId("Invalid area ID"),
    sector: optionalObjectId("Invalid sector ID"),
    currentLocation: optionalObjectId("Invalid current location ID"),

    notes: z.string().optional(),
  })
  .loose();
