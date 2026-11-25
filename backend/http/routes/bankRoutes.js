// backend/http/routes/bankRoutes.js
//
// The company bank account is admin-only. It is not area-scoped: one account
// covers the whole company.

import express from "express";

import {
  getAccount,
  updateAccountHandler,
  getMonth,
  getYear,
  createEntryHandler,
  updateEntryHandler,
  deleteEntryHandler,
  getAuditLogs,
} from "../controllers/bankController.js";

import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { validate } from "../validators/validate.js";
import {
  createBankEntrySchema,
  updateBankEntrySchema,
  updateBankAccountSchema,
} from "../validators/bankSchemas.js";

const router = express.Router();

router.use(authorizeRoles("admin"));

// Account
router.get("/account", getAccount);
router.put("/account", validate(updateBankAccountSchema), updateAccountHandler);

// Reports
router.get("/reports/months/:year/:month", getMonth);
router.get("/reports/years/:year", getYear);

// Entries
router.post("/entries", validate(createBankEntrySchema), createEntryHandler);
router.patch("/entries/:id", validate(updateBankEntrySchema), updateEntryHandler);
router.delete("/entries/:id", deleteEntryHandler);

// Audit trail
router.get("/audit", getAuditLogs);

export default router;
