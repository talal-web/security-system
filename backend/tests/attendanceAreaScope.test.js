import test from "node:test";
import assert from "node:assert/strict";

import { enforceAreaScope } from "../src/middleware/areaScopeMiddleware.js";
import Attendance from "../src/models/Attendance.js";
import Employee from "../src/models/Employee.js";
import {
  getAttendanceByIdService,
  submitAttendanceSessionService,
} from "../src/services/attendance/attendance.service.js";
import { getAttendanceReportService } from "../src/services/attendance/attendanceReport.service.js";
import { getMonthlyAttendanceReportService } from "../src/services/attendance/attendanceMonthly.service.js";
import { normalizeDate } from "../src/utils/normalize.js";

const areaA = "507f1f77bcf86cd799439011";
const areaB = "507f1f77bcf86cd799439012";

test("attendance rejects unassigned areas and employees outside the selected area", async () => {
  const req = {
    user: { role: "clerk", areas: [areaA] },
    query: {},
    body: { area: areaB },
  };
  const res = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return payload;
    },
  };
  let nextCalled = false;

  enforceAreaScope(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 403);
  assert.equal(nextCalled, false);

  const originalEmployeeFind = Employee.find;
  const originalAttendanceBulkWrite = Attendance.bulkWrite;
  let attendanceWriteCalled = false;

  Employee.find = (filter) => {
    assert.equal(String(filter.area), areaB);

    return {
      select() {
        return this;
      },
      populate() {
        return this;
      },
      lean: async () => [],
    };
  };

  Attendance.bulkWrite = async () => {
    attendanceWriteCalled = true;
  };

  try {
    await assert.rejects(
      () =>
        submitAttendanceSessionService({
          body: {
            date: normalizeDate(new Date()),
            employees: [
              {
                employeeId: "507f1f77bcf86cd799439013",
                status: "absent",
                shift: null,
                locationId: null,
              },
            ],
          },
          areaScope: { areaId: areaB },
        }),
      /Some employees have invalid attendance data/,
    );

    assert.equal(attendanceWriteCalled, false);
  } finally {
    Employee.find = originalEmployeeFind;
    Attendance.bulkWrite = originalAttendanceBulkWrite;
  }
});

test("attendance writes the validated area scope onto new records", async () => {
  const employeeId = "507f1f77bcf86cd799439013";
  const employee = {
    _id: employeeId,
    empId: "TEST-0001",
    name: "Area Scoped Employee",
    fatherName: "Parent",
    designation: "guard",
    currentLocation: null,
  };
  const originalEmployeeFind = Employee.find;
  const originalAttendanceBulkWrite = Attendance.bulkWrite;
  let operations = [];

  Employee.find = (filter) => {
    assert.equal(String(filter.area), areaB);

    return {
      select() {
        return this;
      },
      populate() {
        return this;
      },
      lean: async () => [employee],
    };
  };

  Attendance.bulkWrite = async (nextOperations) => {
    operations = nextOperations;
  };

  try {
    await submitAttendanceSessionService({
      body: {
        area: areaA,
        date: normalizeDate(new Date()),
        employees: [
          {
            employeeId,
            status: "absent",
            shift: null,
            locationId: null,
          },
        ],
      },
      areaScope: { areaId: areaB },
    });

    assert.equal(
      operations[0].updateOne.update.$set.area.toString(),
      areaB,
    );
  } finally {
    Employee.find = originalEmployeeFind;
    Attendance.bulkWrite = originalAttendanceBulkWrite;
  }
});

test("attendance detail hides records stored under another area", async () => {
  const originalFindById = Attendance.findById;
  const originalEmployeeExists = Employee.exists;
  let employeeLookupCalled = false;

  Attendance.findById = () => ({
    lean: async () => ({
      _id: "507f1f77bcf86cd799439014",
      employee: "507f1f77bcf86cd799439013",
      area: areaA,
    }),
  });
  Employee.exists = async () => {
    employeeLookupCalled = true;
    return true;
  };

  try {
    await assert.rejects(
      () =>
        getAttendanceByIdService({
          id: "507f1f77bcf86cd799439014",
          areaScope: { areaId: areaB },
        }),
      /Attendance record not found/,
    );
    assert.equal(employeeLookupCalled, false);
  } finally {
    Attendance.findById = originalFindById;
    Employee.exists = originalEmployeeExists;
  }
});

test("daily attendance reports scope by validated area, not query area", async () => {
  const employeeId = "507f1f77bcf86cd799439013";
  const originalEmployeeFind = Employee.find;
  const originalAttendanceAggregate = Attendance.aggregate;

  Employee.find = (filter) => {
    assert.equal(String(filter.area), areaB);

    return {
      select() {
        return this;
      },
      lean: async () => [{ _id: employeeId }],
    };
  };

  Attendance.aggregate = async (pipeline) => {
    const matchStage = pipeline[0];
    const facetStage = pipeline.find((stage) => stage.$facet)?.$facet;
    const [storedAreaMatch, legacyAreaMatch] = matchStage.$match.$or;

    assert.equal(storedAreaMatch.area.toString(), areaB);
    assert.deepEqual(legacyAreaMatch, {
      area: null,
      employee: { $in: [employeeId] },
    });
    assert.equal(
      facetStage.leaveEmployees[1].$project.attendanceId,
      "$_id",
    );

    return [
      {
        globalStats: [],
        presentSectors: [],
        absentEmployees: [],
        leaveEmployees: [],
      },
    ];
  };

  try {
    await getAttendanceReportService({
      query: {
        area: areaA,
        date: normalizeDate(new Date()),
      },
      areaScope: { areaId: areaB },
    });
  } finally {
    Employee.find = originalEmployeeFind;
    Attendance.aggregate = originalAttendanceAggregate;
  }
});

test("monthly reports retain historical records under their stored area", async () => {
  const employeeId = "507f1f77bcf86cd799439013";
  const month = new Date().toISOString().slice(0, 7);
  const originalEmployeeFind = Employee.find;
  const originalAttendanceFind = Attendance.find;

  Employee.find = () => ({
    select() {
      return this;
    },
    sort() {
      return this;
    },
    lean: async () => [],
  });

  Attendance.find = (filter) => {
    assert.equal(filter.$or[0].area, areaA);

    return {
      select() {
        return this;
      },
      lean: async () => [
        {
          employee: employeeId,
          area: areaA,
          employeeSnapshot: {
            empId: "TEST-0001",
            name: "Former Area A Employee",
            fatherName: "Parent",
            designation: "guard",
          },
          date: `${month}-01`,
          status: "present",
        },
      ],
    };
  };

  try {
    const result = await getMonthlyAttendanceReportService({
      query: { month },
      areaScope: { areaId: areaA },
    });

    assert.equal(result.data.employees.length, 1);
    assert.equal(result.data.employees[0].employeeId, employeeId);
    assert.equal(result.data.employees[0].attendance[1], "P");
  } finally {
    Employee.find = originalEmployeeFind;
    Attendance.find = originalAttendanceFind;
  }
});