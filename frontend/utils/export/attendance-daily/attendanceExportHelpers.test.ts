import assert from "node:assert/strict";
import test from "node:test";

import {
  formatAttendanceShift,
  formatAttendanceStatus,
} from "./attendanceExportFormat";
import { groupEmployeesBySectorAndLocation } from "./attendanceExportGrouping";

const employees = [
  {
    attendanceId: "a1",
    employeeId: "e1",
    empId: "EMP-1",
    name: "Ali",
    fatherName: "Ahmed",
    designation: "Guard",
    location: "HQ",
    sector: "North",
    shift: "day" as const,
    status: "present" as const,
    remarks: "",
    date: "2026-08-24",
  },
  {
    attendanceId: "a2",
    employeeId: "e2",
    empId: "EMP-2",
    name: "Bilal",
    fatherName: "Khan",
    designation: "Guard",
    location: "Gate",
    sector: "North",
    shift: "night" as const,
    status: "absent" as const,
    remarks: "",
    date: "2026-08-24",
  },
];

test("formats attendance status and shift labels", () => {
  assert.equal(formatAttendanceStatus("present"), "Present");
  assert.equal(formatAttendanceStatus("absent"), "Absent");
  assert.equal(formatAttendanceStatus("leave"), "Leave");
  assert.equal(formatAttendanceStatus(undefined), "-");

  assert.equal(formatAttendanceShift("day"), "Day");
  assert.equal(formatAttendanceShift("night"), "Night");
  assert.equal(formatAttendanceShift(undefined), "-");
});

test("groups employees by sector and location in the original order", () => {
  const grouped = groupEmployeesBySectorAndLocation(employees);

  assert.equal(grouped.size, 1);

  const northGroup = grouped.get("North");
  assert.ok(northGroup);
  assert.equal(northGroup?.size, 2);
  assert.deepEqual(Array.from(northGroup!.keys()), ["HQ", "Gate"]);
  assert.equal(northGroup?.get("HQ")?.[0].name, "Ali");
  assert.equal(northGroup?.get("Gate")?.[0].name, "Bilal");
});
