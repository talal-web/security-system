import { z } from "zod";

const phonePattern = /^[0-9+\-\s()]{7,20}$/;

// --------------------------------------------------
// Phone Validation
// --------------------------------------------------

const employeePhoneSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .max(20, "Phone number must be 20 characters or fewer")
  .regex(phonePattern, "Enter a valid phone number");

const requiredContactPhoneSchema = z
  .string()
  .trim()
  .min(1, "Contact number is required")
  .max(20, "Phone number must be 20 characters or fewer")
  .regex(phonePattern, "Enter a valid phone number");

// --------------------------------------------------
// Emergency Contact
// --------------------------------------------------

const emergencyContactEntrySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),

  relation: z
    .string()
    .trim()
    .min(1, "Relation is required")
    .max(50, "Relation must be 50 characters or fewer"),

  contact: requiredContactPhoneSchema,

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(300, "Address must be 300 characters or fewer"),

  isPrimary: z.boolean(),
});

// --------------------------------------------------
// Reference
// --------------------------------------------------

const referenceEntrySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),

  relation: z
    .string()
    .trim()
    .min(1, "Relation is required")
    .max(50, "Relation must be 50 characters or fewer"),

  contact: requiredContactPhoneSchema,

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(300, "Address must be 300 characters or fewer"),
});

// --------------------------------------------------
// Emergency Contacts Array
// --------------------------------------------------

const emergencyContactsSchema = z
  .array(emergencyContactEntrySchema)
  .min(1, "At least one emergency contact is required")
  .superRefine((contacts, context) => {
    const primaryCount = contacts.filter(
      (contact) => contact.isPrimary,
    ).length;

    if (primaryCount > 1) {
      context.addIssue({
        code: "custom",
        message: "Only one emergency contact can be primary",
      });
    }
  });

// --------------------------------------------------
// References Array
// --------------------------------------------------

const referencesSchema = z
  .array(referenceEntrySchema)
  .min(1, "At least one reference is required");

// --------------------------------------------------
// Contact Fields Schema
// --------------------------------------------------

export const employeeContactFieldsSchema = z
  .object({
    phone1: employeePhoneSchema,

    emergencyContacts: emergencyContactsSchema,

    references: referencesSchema,
  })
  .passthrough();

// --------------------------------------------------
// Employee Schema
// --------------------------------------------------

export const employeeSchema = z.object({
  // Personal Information
  name: z
    .string()
    .trim()
    .min(2, "Name is required"),

  fatherName: z
    .string()
    .trim()
    .min(2, "Father name is required"),

  birthDate: z
    .string()
    .min(1, "Birth date is required"),

  cnic: z
    .string()
    .trim()
    .min(5, "CNIC is required"),

  address: z
    .string()
    .trim()
    .min(3, "Address is required"),

  // ------------------------------------------------
  // Contact Information
  // ------------------------------------------------

  phone1: employeePhoneSchema,

  emergencyContacts: emergencyContactsSchema,

  references: referencesSchema,

  // ------------------------------------------------
  // Employment Information
  // ------------------------------------------------

  designation: z
    .string()
    .min(1, "Designation is required")
    .refine(
      (value) =>
        [
          "guard",
          "army_guard",
          "asst_supervisor",
          "supervisor",
          "mcr",
          "driver",
          "clerk",
        ].includes(value),
      "Invalid designation",
    ),

  education: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .enum([
        "none",
        "middle",
        "matric",
        "fsc",
        "bs",
        "master",
      ])
      .optional(),
  ),

  status: z
    .enum(["active", "inactive"])
    .optional(),

  // ------------------------------------------------
  // Location
  // ------------------------------------------------

  area: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().optional(),
  ),

  sector: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().optional(),
  ),

  currentLocation: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().optional(),
  ),

  defaultShift: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .enum(["day", "night"])
      .optional(),
  ),

  // ------------------------------------------------
  // Dates
  // ------------------------------------------------

  entryDate: z.string().optional(),

  exitDate: z
    .string()
    .optional(),

  // ------------------------------------------------
  // Salary
  // ------------------------------------------------

  monthlySalary: z.coerce
    .number({
      error: "Monthly salary is required",
    })
    .min(0, "Monthly salary must be 0 or greater"),
}).superRefine((values, context) => {
  if (values.status === "active" && !values.entryDate) {
    context.addIssue({
      code: "custom",
      path: ["entryDate"],
      message: "Entry date is required for an active employee.",
    });
  }

  if (values.status === "inactive" && !values.exitDate) {
    context.addIssue({
      code: "custom",
      path: ["exitDate"],
      message: "Exit date is required for an inactive employee.",
    });
  }
});
