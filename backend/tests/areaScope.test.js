import test from "node:test";
import assert from "node:assert/strict";

import {
  getPermittedAreaIds,
  resolveScopedAreaIds,
  createAreaScopeFilter,
  ensureEmployeeAreaAccess,
  validateRequestedAreaAccess,
} from "../src/utils/areaScope.js";

const validAreaA = "507f1f77bcf86cd799439011";
const validAreaB = "507f1f77bcf86cd799439012";

test("admin and developer are unrestricted across all areas", () => {
  assert.deepEqual(getPermittedAreaIds({ role: "admin", areas: [] }), []);
  assert.deepEqual(
    getPermittedAreaIds({ role: "admin", areas: [validAreaA] }),
    [],
  );
  assert.deepEqual(getPermittedAreaIds({ role: "developer", areas: [] }), []);
});

test("clerk and supervisor are restricted to assigned areas", () => {
  assert.deepEqual(
    getPermittedAreaIds({
      role: "supervisor",
      areas: [validAreaA, validAreaB],
    }),
    [validAreaA, validAreaB],
  );

  assert.deepEqual(
    getPermittedAreaIds({ role: "clerk", areas: [validAreaA] }),
    [validAreaA],
  );
});

test("empty permitted area lists are never treated as unrestricted for restricted roles", () => {
  assert.throws(
    () => resolveScopedAreaIds({ role: "clerk", areas: [] }, validAreaA),
    {
      message: /no area access assigned|unauthorized/i,
    },
  );

  assert.throws(
    () => createAreaScopeFilter({ role: "supervisor", areas: [] }),
    {
      message: /no area access assigned|unauthorized/i,
    },
  );
});

test("resolveScopedAreaIds rejects unauthorized and malformed area requests", () => {
  assert.throws(
    () =>
      resolveScopedAreaIds({ role: "clerk", areas: [validAreaA, validAreaB] }, [
        validAreaA,
        "bad-id",
      ]),
    {
      message: /invalid area|unauthorized/i,
    },
  );

  assert.throws(
    () =>
      resolveScopedAreaIds({ role: "clerk", areas: [validAreaA, validAreaB] }, [
        validAreaA,
        validAreaB,
        "ffffffffffffffffffffffff",
      ]),
    {
      message: /unauthorized/i,
    },
  );
});

test("createAreaScopeFilter applies a trusted area scope for restricted users", () => {
  const filter = createAreaScopeFilter({
    role: "clerk",
    areas: [validAreaA, validAreaB],
  });

  assert.deepEqual(filter, { area: { $in: [validAreaA, validAreaB] } });

  const narrowed = createAreaScopeFilter(
    { role: "clerk", areas: [validAreaA, validAreaB] },
    [validAreaA],
  );

  assert.deepEqual(narrowed, { area: { $in: [validAreaA] } });
});

test("validateRequestedAreaAccess rejects injection-shaped values and unauthorized selections", () => {
  assert.throws(
    () =>
      validateRequestedAreaAccess({ role: "clerk", areas: [validAreaA] }, [
        "$where",
        validAreaA,
      ]),
    {
      message: /invalid area|unauthorized/i,
    },
  );

  assert.throws(
    () =>
      validateRequestedAreaAccess({ role: "clerk", areas: [validAreaA] }, [
        validAreaB,
      ]),
    {
      message: /unauthorized/i,
    },
  );
});

test("ensureEmployeeAreaAccess enforces employee area assignment", () => {
  assert.doesNotThrow(() =>
    ensureEmployeeAreaAccess(
      { role: "clerk", areas: [validAreaA, validAreaB] },
      { area: validAreaA },
    ),
  );

  assert.throws(
    () =>
      ensureEmployeeAreaAccess(
        { role: "clerk", areas: [validAreaA, validAreaB] },
        { area: "aaaaaaaaaaaaaaaaaaaaaaaa" },
      ),
    {
      message: /unauthorized|invalid/i,
    },
  );
});
