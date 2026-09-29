import test from "node:test";
import assert from "node:assert/strict";

import Bonus from "../src/models/Bonus.js";
import Employee from "../src/models/Employee.js";
import { createBonusService } from "../src/services/bonus/bonus.service.js";

const originalFindById = Employee.findById;
const originalBonusCreate = Bonus.create;

test("createBonus rejects employees outside a restricted user's area scope", async () => {
  const res = {
    status(code) {
      this.code = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return payload;
    },
  };

  Employee.findById = async () => ({
    _id: "507f1f77bcf86cd799439011",
    area: "507f1f77bcf86cd799439099",
    status: "active",
    select: () => ({
      _id: "507f1f77bcf86cd799439011",
      area: "507f1f77bcf86cd799439099",
      status: "active",
    }),
  });

  Bonus.create = async () => ({
    _id: "bonus-1",
  });

  try {
    await createBonusService(
      {
        body: {
          employee: "507f1f77bcf86cd799439011",
          amount: 1000,
          bonusDate: "2025-01-10",
          reason: "Test bonus",
        },
        user: { id: "user-1" },
        areaScope: {
          isAdmin: false,
          permittedAreaIds: ["507f1f77bcf86cd799439022"],
          requestedAreaIds: ["507f1f77bcf86cd799439022"],
          filter: { area: { $in: ["507f1f77bcf86cd799439022"] } },
        },
      },
      res,
    );

    assert.equal(res.code, 403);
    assert.match(res.payload.message, /Unauthorized area access/i);
  } finally {
    Employee.findById = originalFindById;
    Bonus.create = originalBonusCreate;
  }
});
