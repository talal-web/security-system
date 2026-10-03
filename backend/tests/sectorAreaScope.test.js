import test from "node:test";
import assert from "node:assert/strict";

import sectorRoutes from "../src/routes/sectorRoutes.js";
import { requireAreaAccess } from "../src/middleware/areaScopeMiddleware.js";

test("every sector endpoint requires validated area scope", () => {
  const routes = sectorRoutes.stack.filter((layer) => layer.route);

  assert.ok(routes.length > 0);

  for (const { route } of routes) {
    const method = Object.keys(route.methods).join(",").toUpperCase();
    const hasAreaScope = route.stack.some(
      (layer) => layer.handle === requireAreaAccess,
    );

    assert.ok(hasAreaScope, `${method} ${route.path} must require area access`);
  }
});