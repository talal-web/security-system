import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string().min(2),
  fatherName: z.string().min(2),

  cnic: z.string().min(5),

  phone1: z.string().min(5),
  phone2: z.string().optional(),

  address: z.string().min(3),

  status: z.enum(["active", "inactive"]),

  education: z.enum([
    "nil",
    "middle",
    "matric",
    "fsc",
    "intermediate",
    "bs",
    "master",
  ]),

  designation: z.enum([
    "guard",
    "army guard",
    "asst supervisor",
    "supervisor",
    "mcr",
    "driver",
    "clerk",
  ]),

  sector: z.enum(["zone_1_a", "zone_1_b", "zone_1_c", "zone_1_d"]),
  currentLocation: z.string().min(1, "Location is required"),

  birthDate: z.string(),
  entryDate: z.string(),
  exitDate: z.string().optional(),

  basicSalary: z.coerce.number().min(0, "Basic salary cannot be negative"),

  reference: z.string().optional(),
});
