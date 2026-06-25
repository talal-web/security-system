import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string().min(2, "Name is required"),

  fatherName: z.string().min(2, "Father name is required"),

  birthDate: z.string().min(1, "Birth date is required"),

  cnic: z.string().min(5, "CNIC is required"),

  address: z.string().min(3, "Address is required"),

  phone1: z.string().min(5, "Phone number is required"),

  phone2: z.string().optional(),

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
    z.enum(["middle", "matric", "fsc", "bs", "master"]).optional(),
  ),

  status: z.enum(["active", "inactive"]).optional(),

  sector: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .enum(["zone_1_a", "zone_1_b", "zone_1_c", "zone_1_d", "rawalpindi"])
      .optional(),
  ),

  currentLocation: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().optional(),
  ),

  defaultShift: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(["day", "night"]).optional(),
  ),

  entryDate: z.string().min(1, "Entry date is required"),

  exitDate: z.string().optional(),

  basicSalary: z.coerce.number().min(0).optional(),

  reference: z.string().optional(),
});
