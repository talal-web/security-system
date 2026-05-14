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
  designation: z.enum(["guard", "army guard", "supervisor", "driver", "clerk"]),

  birthDate: z.string(),
  entryDate: z.string(),
  exitDate: z.string().optional(),
  reference: z.string().optional(),
});
