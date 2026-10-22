// http/validators/attendanceSchemas.js
//
// Request-shape validation for the attendance routes. This only checks
// that the request is well-formed (required fields present, correct
// types, known enum values, and the shift/location-presence rules implied
// by status). It does NOT check anything that requires database state
// (employee/location/sector existence, area-scope matching, whether an
// employee is active, or the "attendance can only be marked for today"
// rule) - those remain business rules owned by AttendanceService and
// attendance.validation.js.

import { z } from "zod";

import { objectIdString } from "./common.js";

const STATUSES = ["present", "absent", "leave"];
const SHIFTS = ["day", "night"];

// ======================================
// POST /attendance/session
// ======================================

const attendanceItemSchema = z
  .object({
    employeeId: objectIdString("Invalid employee ID"),
    status: z.enum(STATUSES, {
      message: `Invalid status. Allowed values: ${STATUSES.join(", ")}`,
    }),
    shift: z.enum(SHIFTS).nullish(),
    locationId: objectIdString("Invalid location ID").nullish(),
    remarks: z.string().optional(),
  })
  .superRefine((item, ctx) => {
    if (item.status === "present") {
      if (!item.shift) {
        ctx.addIssue({
          code: "custom",
          path: ["shift"],
          message: `Invalid shift. Allowed values: ${SHIFTS.join(", ")}`,
        });
      }

      if (!item.locationId) {
        ctx.addIssue({
          code: "custom",
          path: ["locationId"],
          message: "Location is required",
        });
      }
    } else if (item.shift != null || item.locationId != null) {
      ctx.addIssue({
        code: "custom",
        message: "Shift and location must be empty for absent/leave",
      });
    }
  });

export const submitAttendanceSessionSchema = z
  .object({
    date: z.string().trim().min(1, "Date is required"),
    employees: z
      .array(attendanceItemSchema)
      .min(1, "Employees data is required"),
  })
  .loose();

// ======================================
// PATCH /attendance/session/locations
// ======================================

export const updateEmployeeLocationsSchema = z
  .object({
    employees: z
      .array(
        z.object({
          employeeId: objectIdString("Invalid employee ID"),
          locationId: objectIdString("Invalid location ID"),
        }),
      )
      .min(1, "Employees data is required"),
  })
  .loose();

// ======================================
// PATCH /attendance/session/sectors
// ======================================

export const updateEmployeesSectorSchema = z
  .object({
    employees: z
      .array(
        z.object({
          employeeId: objectIdString("Invalid employee ID"),
          sectorId: objectIdString("Invalid sector ID"),
          locationId: objectIdString("Invalid location ID"),
        }),
      )
      .min(1, "Employees data is required")
      .superRefine((employees, ctx) => {
        const seen = new Set();

        employees.forEach((item, index) => {
          if (seen.has(item.employeeId)) {
            ctx.addIssue({
              code: "custom",
              path: [index, "employeeId"],
              message: "Each employee can only be transferred once.",
            });
          }

          seen.add(item.employeeId);
        });
      }),
  })
  .loose();

// ======================================
// PATCH /attendance/session/shifts
// ======================================

export const updateEmployeeShiftsSchema = z
  .object({
    employees: z
      .array(
        z.object({
          employeeId: objectIdString("Invalid employee ID"),
          shift: z.enum(SHIFTS, {
            message: "Shift must be either day or night",
          }),
        }),
      )
      .min(1, "Employees data is required"),
  })
  .loose();

// ======================================
// PATCH /attendance/:id
// ======================================

export const updateAttendanceSchema = z
  .object({
    status: z.enum(STATUSES).optional(),
    shift: z.enum(SHIFTS).nullish(),
    location: z.union([objectIdString("Invalid location ID"), z.literal("")]).nullish(),
    remarks: z.string().optional(),
  })
  .loose();
