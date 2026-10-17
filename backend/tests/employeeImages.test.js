import test from "node:test";
import assert from "node:assert/strict";

import { getMissingEmployeeImageFields } from "../src/utils/employeeImages.js";

test("reports all required employee images when none are uploaded", () => {
  assert.deepEqual(getMissingEmployeeImageFields(), [
    "profileImage",
    "cnicFrontImage",
    "cnicBackImage",
  ]);
});

test("reports only missing employee images", () => {
  assert.deepEqual(
    getMissingEmployeeImageFields({
      profileImage: [{ filename: "profile.jpg" }],
      cnicFrontImage: [{ filename: "front.jpg" }],
    }),
    ["cnicBackImage"],
  );
});

test("accepts all required employee images", () => {
  assert.deepEqual(
    getMissingEmployeeImageFields({
      profileImage: [{ filename: "profile.jpg" }],
      cnicFrontImage: [{ filename: "front.jpg" }],
      cnicBackImage: [{ filename: "back.jpg" }],
    }),
    [],
  );
});