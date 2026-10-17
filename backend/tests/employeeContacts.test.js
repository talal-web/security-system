import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeEmployeeContactData,
  planLegacyContactMigration,
} from "../src/utils/employeeContacts.js";
import Employee from "../src/models/Employee.js";

const normalizePhone = (value) => value.replace(/\D/g, "");

test("normalizes JSON contact arrays, filters blank rows, and preserves empty arrays", () => {
  assert.deepEqual(
    normalizeEmployeeContactData(
      {
        emergencyContacts: JSON.stringify([
          {
            name: "  Sam  ",
            relation: "Sibling",
            contact: "+1 (555) 0100",
            address: " Home ",
            isPrimary: true,
          },
          {
            name: "",
            relation: "",
            contact: "",
            address: "",
            isPrimary: false,
          },
        ]),
        references: "[]",
      },
      normalizePhone,
    ),
    {
      emergencyContacts: [
        {
          name: "Sam",
          relation: "Sibling",
          contact: "15550100",
          address: "Home",
          isPrimary: true,
        },
      ],
      references: [],
    },
  );
});

test("rejects malformed contact array payloads", () => {
  assert.throws(
    () => normalizeEmployeeContactData({ emergencyContacts: "not-json" }, normalizePhone),
    { statusCode: 400, message: /valid JSON array/ },
  );
});

test("accepts legacy payload fields while converting to the new API shape", () => {
  assert.deepEqual(
    normalizeEmployeeContactData(
      { phone2: " 555-0100 ", reference: "  Jordan  " },
      normalizePhone,
    ),
    {},
  );
});

test("rejects multiple populated primary emergency contacts", () => {
  assert.throws(
    () =>
      normalizeEmployeeContactData(
        {
          emergencyContacts: JSON.stringify([
            { name: "A", isPrimary: true },
            { name: "B", isPrimary: true },
          ]),
        },
        normalizePhone,
      ),
    { statusCode: 400, message: /at most one primary contact/ },
  );
});

test("migration maps legacy values into arrays and becomes idempotent", () => {
  assert.deepEqual(
    planLegacyContactMigration({
      phone2: "555-0100",
      reference: "Jordan",
    }),
    {
      $set: {
        emergencyContacts: [
          {
            name: "",
            relation: "",
            contact: "555-0100",
            address: "",
            isPrimary: true,
          },
        ],
        references: [
          { name: "Jordan", relation: "", contact: "", address: "" },
        ],
      },
      $unset: { phone2: "", reference: "" },
      conflicts: [],
      needsChange: true,
    },
  );

  assert.deepEqual(
    planLegacyContactMigration({
      emergencyContacts: [
        {
          name: "",
          relation: "",
          contact: "555-0100",
          address: "",
          isPrimary: true,
        },
      ],
      references: [{ name: "Jordan", relation: "", contact: "", address: "" }],
    }).needsChange,
    false,
  );
});

test("migration leaves conflicting existing arrays unchanged", () => {
  const plan = planLegacyContactMigration({
    phone2: "555-0100",
    emergencyContacts: [{ name: "Existing", contact: "555-0200" }],
  });

  assert.deepEqual(plan.$set, {});
  assert.deepEqual(plan.$unset, {});
  assert.match(plan.conflicts[0], /not overwritten/);
});

test("Employee model rejects multiple primary contacts without middleware callbacks", async () => {
  const employee = new Employee({
    empId: "TEST-EMPLOYEE",
    name: "Test Employee",
    fatherName: "Test Parent",
    birthDate: new Date("1990-01-01"),
    cnic: "12345-1234567-1",
    address: "Test address",
    phone1: "0300-1234567",
    designation: "guard",
    entryDate: new Date("2024-01-01"),
    emergencyContacts: [
      { name: "Contact One", isPrimary: true },
      { name: "Contact Two", isPrimary: true },
    ],
  });

  await assert.rejects(employee.validate(), (error) => {
    assert.equal(error.name, "ValidationError");
    assert.match(
      error.errors.emergencyContacts.message,
      /at most one primary emergency contact/i,
    );
    return true;
  });
});