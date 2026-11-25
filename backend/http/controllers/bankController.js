// backend/http/controllers/bankController.js

import ApiError from "../../src/utils/ApiError.js";
import {
  getAccountSummary,
  updateAccount,
  createEntry,
  updateEntry,
  deleteEntry,
  getMonthlyReport,
  getYearSummary,
  listAuditLogs,
} from "../../src/services/bank/BankService.js";
import {
  periodParamsSchema,
  yearParamsSchema,
  auditQuerySchema,
} from "../validators/bankSchemas.js";

const parseParams = (schema, params) => {
  const result = schema.safeParse(params);
  if (!result.success) {
    throw new ApiError(400, result.error.issues[0]?.message || "Invalid period");
  }
  return result.data;
};

/**
 * GET /api/bank/account
 */
export const getAccount = async (req, res) => {
  const data = await getAccountSummary({ userId: req.user.id });

  res.status(200).json({ success: true, data });
};

/**
 * PUT /api/bank/account
 */
export const updateAccountHandler = async (req, res) => {
  const account = await updateAccount({ data: req.body, userId: req.user.id });

  res.status(200).json({
    success: true,
    message: "Bank account updated",
    data: account,
  });
};

/**
 * GET /api/bank/reports/months/:year/:month
 */
export const getMonth = async (req, res) => {
  const { year, month } = parseParams(periodParamsSchema, req.params);
  const data = await getMonthlyReport({ year, month, userId: req.user.id });

  res.status(200).json({ success: true, data });
};

/**
 * GET /api/bank/reports/years/:year
 */
export const getYear = async (req, res) => {
  const { year } = parseParams(yearParamsSchema, req.params);
  const data = await getYearSummary({ year, userId: req.user.id });

  res.status(200).json({ success: true, data });
};

/**
 * POST /api/bank/entries
 */
export const createEntryHandler = async (req, res) => {
  const entry = await createEntry({ data: req.body, userId: req.user.id });

  res.status(201).json({
    success: true,
    message: "Bank entry recorded",
    data: entry,
  });
};

/**
 * PATCH /api/bank/entries/:id
 */
export const updateEntryHandler = async (req, res) => {
  const entry = await updateEntry({
    id: req.params.id,
    data: req.body,
    userId: req.user.id,
  });

  res.status(200).json({
    success: true,
    message: "Bank entry updated",
    data: entry,
  });
};

/**
 * DELETE /api/bank/entries/:id
 */
export const deleteEntryHandler = async (req, res) => {
  await deleteEntry({ id: req.params.id, userId: req.user.id });

  res.status(200).json({
    success: true,
    message: "Bank entry deleted",
  });
};

/**
 * GET /api/bank/audit?entityId=&limit=
 */
export const getAuditLogs = async (req, res) => {
  const query = parseParams(auditQuerySchema, req.query);
  const logs = await listAuditLogs(query);

  res.status(200).json({
    success: true,
    count: logs.length,
    data: logs,
  });
};
