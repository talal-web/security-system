import test from "node:test";
import assert from "node:assert/strict";

import Bonus from "../src/models/Bonus.js";
import Employee from "../src/models/Employee.js";
import { createBonusService } from "../src/services/bonus/bonus.service.js";

const originalFindById = Employee.findById;
const originalBonusCreate = Bonus.create;

test("createBonus rejects employees outside a restricted user's area scope", async () => {
  let bonusCreateCalled = false;

  Employee.findById = () => ({
    select: async () => ({
      _id: "507f1f77bcf86cd799439011",
      area: "507f1f77bcf86cd799439011",
      empId: "TEST-0001",
      name: "Test Employee",
      fatherName: "Parent",
      designation: "guard",
      status: "active",
    }),
  });

  Bonus.create = async () => {
    bonusCreateCalled = true;
    return { _id: "bonus-1" };
  };

  try {
    await assert.rejects(
      () =>
        createBonusService(
          {
            employeeId: "507f1f77bcf86cd799439011",
            amount: 1000,
            bonusDate: "2025-01-10",
            reason: "Test bonus",
          },
          "user-1",
          { areaId: "507f1f77bcf86cd799439022" },
        ),
      (error) => {
        assert.equal(error.statusCode, 404);
        assert.match(error.message, /not found in the selected area/i);
        return true;
      },
    );

    assert.equal(bonusCreateCalled, false);
  } finally {
    Employee.findById = originalFindById;
    Bonus.create = originalBonusCreate;
  }
});
