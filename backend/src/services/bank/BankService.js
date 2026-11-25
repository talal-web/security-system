// backend/src/services/bank/BankService.js
//
// The admin's bank account: manual entries, balance rules, monthly and yearly
// reports, and the automatic entries created when invoices and payroll are paid.
//
// Business rules (confirmed):
//  - Outflows that would take the balance below zero are blocked.
//  - Entries can be changed in any month; every change is audit-logged.
//  - Paid invoices create income; paid payroll creates salary outflows.
//  - One account for the whole company.
//
// Balances are never stored. They are always derived from live entries, so
// correcting one entry corrects every later month automatically.

import mongoose from "mongoose";

import BankAccount from "../../models/BankAccount.js";
import BankEntry, { BANK_ENTRY_KINDS } from "../../models/BankEntry.js";
import BankAuditLog from "../../models/BankAuditLog.js";
import ApiError from "../../utils/ApiError.js";

const DEFAULT_ACCOUNT_NAME = "Company bank account";
const EMPLOYEE_KINDS = ["advance", "salary"];
const OUTFLOW_KINDS = ["rent", "expense", "advance", "salary"];
const SAVINGS_KINDS = ["savings_deposit", "savings_withdrawal"];

// ============================================================================
// MONEY AND DATE HELPERS
// ============================================================================

// Integer cents avoid floating-point drift when summing many entries.
const toCents = (amount) => Math.round(Number(amount) * 100);
const fromCents = (cents) => cents / 100;

const formatMoney = (cents) =>
  fromCents(cents).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const isoDay = (date) => new Date(date).toISOString().slice(0, 10);

// Month boundaries in UTC. `month` is 1-based.
const startOfMonthUtc = (year, month) => new Date(Date.UTC(year, month - 1, 1));
const startOfNextMonthUtc = (year, month) => new Date(Date.UTC(year, month, 1));

const firstOfCurrentMonthUtc = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
};

// Opening dates must be the first day of a month, so monthly reports chain cleanly.
const isFirstOfMonthUtc = (date) => new Date(date).getUTCDate() === 1;

// ============================================================================
// TRANSACTIONS AND AUDIT
// ============================================================================

/**
 * Run fn inside a Mongo transaction. Any thrown error (including overdraft
 * and validation failures) rolls back every write made inside fn.
 */
export async function runInTransaction(fn) {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await fn(session);
    });
    return result;
  } finally {
    await session.endSession();
  }
}

async function writeAudit({
  entityType,
  entityId,
  action,
  before = null,
  after = null,
  userId,
  session,
}) {
  await BankAuditLog.create(
    [
      {
        entityType,
        entityId,
        action,
        before,
        after,
        changedBy: userId,
      },
    ],
    { session },
  );
}

const snapshotEntry = (entry) => ({
  kind: entry.kind,
  direction: entry.direction,
  amount: entry.amount,
  entryDate: entry.entryDate,
  category: entry.category,
  description: entry.description,
  employee: entry.employee ?? null,
  source: entry.source ?? null,
  deletedAt: entry.deletedAt ?? null,
});

const snapshotAccount = (account) => ({
  name: account.name,
  openingBalance: account.openingBalance,
  openingDate: account.openingDate,
});

// ============================================================================
// ACCOUNT
// ============================================================================

/**
 * Return the company's bank account, creating it with a zero balance on first
 * use. The admin sets the real opening balance afterwards via updateAccount.
 */
export async function ensureAccount(userId, session) {
  const query = BankAccount.findOne({ isActive: true }).sort({ createdAt: 1 });
  if (session) query.session(session);

  const existing = await query;
  if (existing) return existing;

  const [created] = await BankAccount.create(
    [
      {
        name: DEFAULT_ACCOUNT_NAME,
        openingBalance: 0,
        openingDate: firstOfCurrentMonthUtc(),
        createdBy: userId,
      },
    ],
    { session },
  );

  return created;
}

/**
 * Sum entries by direction ("in" / "out"). Returns cents.
 */
async function totalsByDirection(match, session) {
  const pipeline = [
    { $match: match },
    { $group: { _id: "$direction", total: { $sum: "$amount" } } },
  ];
  const aggregation = BankEntry.aggregate(pipeline);
  if (session) aggregation.session(session);

  const rows = await aggregation;
  const totals = { in: 0, out: 0 };
  for (const row of rows) {
    totals[row._id] = toCents(row.total);
  }
  return totals;
}

/**
 * Sum entries by kind. Returns cents for every known kind (zero if absent).
 */
async function totalsByKind(match, session) {
  const pipeline = [
    { $match: match },
    { $group: { _id: "$kind", total: { $sum: "$amount" } } },
  ];
  const aggregation = BankEntry.aggregate(pipeline);
  if (session) aggregation.session(session);

  const rows = await aggregation;
  const totals = Object.fromEntries(
    Object.keys(BANK_ENTRY_KINDS).map((kind) => [kind, 0]),
  );
  for (const row of rows) {
    totals[row._id] = toCents(row.total);
  }
  return totals;
}

function liveEntryMatch(account, extra = {}) {
  return {
    account: account._id,
    deletedAt: null,
    entryDate: { $gte: account.openingDate },
    ...extra,
  };
}

async function currentBalanceCents(account, session) {
  const totals = await totalsByDirection(liveEntryMatch(account), session);
  return toCents(account.openingBalance) + totals.in - totals.out;
}

/**
 * Throw if the account would go below zero at any point from the opening date
 * onward, after the proposed change is applied.
 *
 * The check replays every live entry in date order (money in before money out
 * on the same date), so a back-dated entry cannot silently overdraw a later
 * month. Pass `proposed` for a create or update, and `excludeEntryId` for an
 * entry that is being replaced or deleted.
 */
async function assertNoOverdraft({
  account,
  session,
  excludeEntryId = null,
  proposed = null,
}) {
  const query = BankEntry.find(liveEntryMatch(account)).select(
    "_id direction amount entryDate",
  );
  if (session) query.session(session);

  const entries = await query.lean();

  const events = entries
    .filter((entry) => !excludeEntryId || String(entry._id) !== String(excludeEntryId))
    .map((entry) => ({
      id: String(entry._id),
      kind: entry.kind,
      direction: entry.direction,
      cents: toCents(entry.amount),
      date: new Date(entry.entryDate),
    }));

  if (proposed) {
    events.push({
      id: "proposed",
      kind: proposed.kind,
      direction: BANK_ENTRY_KINDS[proposed.kind],
      cents: toCents(proposed.amount),
      date: new Date(proposed.entryDate),
    });
  }

  events.sort((a, b) => {
    if (a.date - b.date !== 0) return a.date - b.date;
    if (a.direction !== b.direction) return a.direction === "in" ? -1 : 1;
    return a.id.localeCompare(b.id);
  });

  let running = toCents(account.openingBalance);
  if (running < 0) {
    throw new ApiError(400, "Opening balance cannot be negative");
  }

  // Savings is tracked alongside the bank: you cannot take out more than you saved.
  let saved = 0;

  for (const event of events) {
    running += event.direction === "in" ? event.cents : -event.cents;

    if (event.kind === "savings_deposit") saved += event.cents;
    if (event.kind === "savings_withdrawal") saved -= event.cents;

    if (running < 0) {
      throw new ApiError(
        400,
        `Insufficient bank balance. This would leave the account at ${formatMoney(running)} on ${isoDay(event.date)}.`,
      );
    }

    if (saved < 0) {
      throw new ApiError(
        400,
        `Not enough saved. This withdrawal would take savings below zero on ${isoDay(event.date)}.`,
      );
    }
  }
}

export async function getAccountSummary({ userId }) {
  const account = await ensureAccount(userId);
  const balance = await currentBalanceCents(account);

  const savings = await totalsByKind(liveEntryMatch(account, { kind: { $in: SAVINGS_KINDS } }));

  return {
    id: account._id,
    name: account.name,
    openingBalance: account.openingBalance,
    openingDate: account.openingDate,
    currentBalance: fromCents(balance),
    savingsBalance: fromCents(
      savings.savings_deposit - savings.savings_withdrawal,
    ),
  };
}

/**
 * Update the account name, opening balance, or opening date.
 * The opening date is locked once any entry exists, because moving it would
 * silently reinterpret every existing entry.
 */
export async function updateAccount({ data, userId }) {
  return runInTransaction(async (session) => {
    const account = await ensureAccount(userId, session);
    const before = snapshotAccount(account);

    if (data.openingDate !== undefined) {
      const newDate = new Date(data.openingDate);
      if (newDate.getTime() !== new Date(account.openingDate).getTime()) {
        const hasEntries = await BankEntry.exists({
          account: account._id,
          deletedAt: null,
        }).session(session);

        if (hasEntries) {
          throw new ApiError(
            400,
            "Opening date is locked because entries already exist",
          );
        }
        if (!isFirstOfMonthUtc(newDate)) {
          throw new ApiError(400, "Opening date must be the first day of a month");
        }
        account.openingDate = newDate;
      }
    }

    if (data.name !== undefined) account.name = data.name;
    if (data.openingBalance !== undefined) {
      account.openingBalance = data.openingBalance;
    }
    account.updatedBy = userId;

    // A new opening balance changes every later balance, so re-check the timeline.
    await assertNoOverdraft({ account, session });

    await account.save({ session });

    await writeAudit({
      entityType: "BankAccount",
      entityId: account._id,
      action: "update",
      before,
      after: snapshotAccount(account),
      userId,
      session,
    });

    return account;
  });
}

// ============================================================================
// ENTRIES
// ============================================================================

function assertInAccountWindow(account, entryDate) {
  if (new Date(entryDate) < new Date(account.openingDate)) {
    throw new ApiError(
      400,
      `Entries cannot be dated before the bank account opening date (${isoDay(account.openingDate)})`,
    );
  }
}

// Advances and salaries are created only by the Advances and Payroll flows.
function assertManualKind(kind) {
  if (EMPLOYEE_KINDS.includes(kind)) {
    throw new ApiError(
      400,
      "Advances and salaries are recorded from the Advances and Payroll pages, not here",
    );
  }
}

async function findLiveEntry(id, session) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid entry ID");
  }

  const entry = await BankEntry.findOne({ _id: id, deletedAt: null }).session(session);
  if (!entry) {
    throw new ApiError(404, "Bank entry not found");
  }

  if (entry.source?.kind) {
    throw new ApiError(
      400,
      "Entries created from invoices or payroll are managed from their source record and cannot be changed here",
    );
  }

  return entry;
}

/**
 * Record a manual entry: income received, or an outflow such as rent,
 * an expense, an advance, a salary paid in cash, or a savings movement.
 */
export async function createEntry({ data, userId }) {
  return runInTransaction(async (session) => {
    const account = await ensureAccount(userId, session);
    assertInAccountWindow(account, data.entryDate);

    assertManualKind(data.kind);

    const entry = new BankEntry({
      account: account._id,
      kind: data.kind,
      amount: data.amount,
      entryDate: data.entryDate,
      category: data.category ?? "",
      description: data.description ?? "",
      createdBy: userId,
    });

    await entry.validate();
    await assertNoOverdraft({ account, session, proposed: entry });

    await entry.save({ session });

    await writeAudit({
      entityType: "BankEntry",
      entityId: entry._id,
      action: "create",
      after: snapshotEntry(entry),
      userId,
      session,
    });

    return entry;
  });
}

export async function updateEntry({ id, data, userId }) {
  return runInTransaction(async (session) => {
    const entry = await findLiveEntry(id, session);
    const account = await BankAccount.findById(entry.account).session(session);
    const before = snapshotEntry(entry);

    if (data.entryDate !== undefined) {
      assertInAccountWindow(account, data.entryDate);
    }

    if (data.kind !== undefined) assertManualKind(data.kind);
    if (EMPLOYEE_KINDS.includes(entry.kind)) {
      throw new ApiError(
        400,
        "This entry is an advance or salary and must be changed from the Advances or Payroll page",
      );
    }

    if (data.kind !== undefined) entry.kind = data.kind;
    if (data.amount !== undefined) entry.amount = data.amount;
    if (data.entryDate !== undefined) entry.entryDate = data.entryDate;
    if (data.category !== undefined) entry.category = data.category;
    if (data.description !== undefined) entry.description = data.description;
    entry.updatedBy = userId;

    await entry.validate();
    await assertNoOverdraft({
      account,
      session,
      excludeEntryId: entry._id,
      proposed: entry,
    });

    await entry.save({ session });

    await writeAudit({
      entityType: "BankEntry",
      entityId: entry._id,
      action: "update",
      before,
      after: snapshotEntry(entry),
      userId,
      session,
    });

    return entry;
  });
}

/**
 * Soft delete. The row stays for the audit trail, and is excluded from every
 * balance and report.
 */
export async function deleteEntry({ id, userId }) {
  return runInTransaction(async (session) => {
    const entry = await findLiveEntry(id, session);
    const account = await BankAccount.findById(entry.account).session(session);
    const before = snapshotEntry(entry);

    entry.deletedAt = new Date();
    entry.deletedBy = userId;

    await assertNoOverdraft({
      account,
      session,
      excludeEntryId: entry._id,
      proposed: null,
    });

    await entry.save({ session });

    await writeAudit({
      entityType: "BankEntry",
      entityId: entry._id,
      action: "delete",
      before,
      userId,
      session,
    });

    return entry;
  });
}

// ============================================================================
// AUTOMATIC ENTRIES (called from invoice and payroll flows, inside their transaction)
// ============================================================================

/**
 * Record a paid invoice as income. Idempotent: a second call for the same
 * invoice returns the existing entry. Payments received before the account's
 * opening date are not recorded, since the account does not track that period.
 */
export async function recordInvoiceIncome({ invoice, userId, session }) {
  const existing = await BankEntry.findOne({
    "source.kind": "Invoice",
    "source.refId": invoice._id,
    deletedAt: null,
  }).session(session);
  if (existing) return existing;

  const account = await ensureAccount(userId, session);
  const entryDate = invoice.paidOn ?? invoice.paidAt ?? new Date();
  if (new Date(entryDate) < new Date(account.openingDate)) return null;

  const entry = new BankEntry({
    account: account._id,
    kind: "income",
    amount: invoice.amount,
    entryDate,
    category: "Client payment",
    description: `Invoice ${invoice.invoiceNumber} - ${invoice.clientName}`,
    source: { kind: "Invoice", refId: invoice._id },
    createdBy: userId,
  });

  await entry.validate();
  await entry.save({ session });

  await writeAudit({
    entityType: "BankEntry",
    entityId: entry._id,
    action: "create",
    after: snapshotEntry(entry),
    userId,
    session,
  });

  return entry;
}

/**
 * Record a paid payroll run as a salary outflow for its net amount.
 * Blocks (throws) if the bank cannot cover it, which rolls back the payroll
 * payment too. Idempotent per payroll run.
 */
export async function recordPayrollSalary({ payroll, userId, session }) {
  const existing = await BankEntry.findOne({
    "source.kind": "Payroll",
    "source.refId": payroll._id,
    deletedAt: null,
  }).session(session);
  if (existing) return existing;

  if (toCents(payroll.netSalary) <= 0) return null;

  const account = await ensureAccount(userId, session);
  const entryDate = payroll.paidAt ?? new Date();
  if (new Date(entryDate) < new Date(account.openingDate)) return null;

  const period = `${String(payroll.month).padStart(2, "0")}/${payroll.year}`;

  const entry = new BankEntry({
    account: account._id,
    kind: "salary",
    amount: payroll.netSalary,
    entryDate,
    category: "Salary",
    description: `Salary for ${period}`,
    employee: payroll.employee,
    source: { kind: "Payroll", refId: payroll._id },
    createdBy: userId,
  });

  await entry.validate();
  await assertNoOverdraft({ account, session, proposed: entry });
  await entry.save({ session });

  await writeAudit({
    entityType: "BankEntry",
    entityId: entry._id,
    action: "create",
    after: snapshotEntry(entry),
    userId,
    session,
  });

  return entry;
}

/**
 * Keep the bank outflow for an employee advance in step with the Advance record.
 *
 * Rules:
 *  - The cash leaves the bank when the advance is given, and stays out until it
 *    is cancelled. Deductions from salary do not create bank entries; they reduce
 *    the salary paid, which is already recorded as a salary outflow.
 *  - Cancelled advances have their bank entry removed.
 *  - Advances dated before the account's opening date are not tracked.
 *  - An advance the bank cannot cover is blocked (throws), which rolls back the
 *    advance change as well.
 *
 * Call inside the same transaction as the Advance write.
 */
export async function syncAdvanceOutflow({
  advance,
  userId,
  session,
  createIfMissing = false,
}) {
  const existing = await BankEntry.findOne({
    "source.kind": "Advance",
    "source.refId": advance._id,
    deletedAt: null,
  }).session(session);

  const account = await ensureAccount(userId, session);
  const entryDate = new Date(advance.advanceDate ?? new Date());
  const shouldExist =
    advance.status !== "cancelled" &&
    entryDate >= new Date(account.openingDate);

  if (!shouldExist) {
    if (existing) {
      const before = snapshotEntry(existing);

      await assertNoOverdraft({
        account,
        session,
        excludeEntryId: existing._id,
        proposed: null,
      });

      existing.deletedAt = new Date();
      existing.deletedBy = userId;
      await existing.save({ session });

      await writeAudit({
        entityType: "BankEntry",
        entityId: existing._id,
        action: "delete",
        before,
        userId,
        session,
      });
    }
    return null;
  }

  // Advances recorded before the bank feature have no linked entry. Editing
  // them must not start a cash outflow now, so entries are only created when
  // the advance itself is being created.
  if (!existing && !createIfMissing) {
    return null;
  }

  if (existing) {
    const before = snapshotEntry(existing);

    existing.amount = advance.amount;
    existing.entryDate = entryDate;
    existing.employee = advance.employee;
    existing.description = advance.description
      ? `Advance: ${advance.description}`
      : "Employee advance";
    existing.updatedBy = userId;

    await existing.validate();
    await assertNoOverdraft({
      account,
      session,
      excludeEntryId: existing._id,
      proposed: existing,
    });
    await existing.save({ session });

    await writeAudit({
      entityType: "BankEntry",
      entityId: existing._id,
      action: "update",
      before,
      after: snapshotEntry(existing),
      userId,
      session,
    });

    return existing;
  }

  const entry = new BankEntry({
    account: account._id,
    kind: "advance",
    amount: advance.amount,
    entryDate,
    category: "Employee advance",
    description: advance.description
      ? `Advance: ${advance.description}`
      : "Employee advance",
    employee: advance.employee,
    source: { kind: "Advance", refId: advance._id },
    createdBy: userId,
  });

  await entry.validate();
  await assertNoOverdraft({ account, session, proposed: entry });
  await entry.save({ session });

  await writeAudit({
    entityType: "BankEntry",
    entityId: entry._id,
    action: "create",
    after: snapshotEntry(entry),
    userId,
    session,
  });

  return entry;
}

// ============================================================================
// REPORTS
// ============================================================================

const emptyKindRow = () => ({
  income: 0,
  rent: 0,
  expense: 0,
  advance: 0,
  salary: 0,
  savings_deposit: 0,
  savings_withdrawal: 0,
});

/**
 * Full picture of one month: opening balance, each category, savings movements,
 * closing balance, and every entry in the month.
 */
export async function getMonthlyReport({ year, month, userId }) {
  const account = await ensureAccount(userId);

  const start = startOfMonthUtc(year, month);
  const end = startOfNextMonthUtc(year, month);

  if (end <= new Date(account.openingDate)) {
    throw new ApiError(400, "This month is before the bank account opening date");
  }

  const [before, kinds, savingsToDate, entries] = await Promise.all([
    totalsByDirection(
      liveEntryMatch(account, { entryDate: { $gte: account.openingDate, $lt: start } }),
    ),
    totalsByKind(liveEntryMatch(account, { entryDate: { $gte: start, $lt: end } })),
    totalsByKind(
      liveEntryMatch(account, {
        kind: { $in: SAVINGS_KINDS },
        entryDate: { $gte: account.openingDate, $lt: end },
      }),
    ),
    BankEntry.find(liveEntryMatch(account, { entryDate: { $gte: start, $lt: end } }))
      .sort({ entryDate: 1, _id: 1 })
      .populate("employee", "name empId")
      .lean(),
  ]);

  const opening = toCents(account.openingBalance) + before.in - before.out;

  const outflows = Object.fromEntries(OUTFLOW_KINDS.map((k) => [k, kinds[k]]));
  const totalOutflows = OUTFLOW_KINDS.reduce((sum, k) => sum + kinds[k], 0);
  const totalIncome = kinds.income;
  const savingsDeposited = kinds.savings_deposit;
  const savingsWithdrawn = kinds.savings_withdrawal;

  const closing =
    opening + totalIncome + savingsWithdrawn - totalOutflows - savingsDeposited;

  const savingsBalance =
    savingsToDate.savings_deposit - savingsToDate.savings_withdrawal;

  return {
    year,
    month,
    opening: fromCents(opening),
    totals: {
      income: fromCents(totalIncome),
      outflows: Object.fromEntries(
        Object.entries(outflows).map(([k, v]) => [k, fromCents(v)]),
      ),
      totalOutflows: fromCents(totalOutflows),
      // Result of the month: income minus spending. Savings are excluded.
      net: fromCents(totalIncome - totalOutflows),
      savingsDeposited: fromCents(savingsDeposited),
      savingsWithdrawn: fromCents(savingsWithdrawn),
    },
    closing: fromCents(closing),
    savingsBalance: fromCents(savingsBalance),
    entries,
  };
}

/**
 * Twelve-month overview for charts. Months before the opening date are omitted.
 */
export async function getYearSummary({ year, userId }) {
  const account = await ensureAccount(userId);

  const yearStart = startOfMonthUtc(year, 1);
  const yearEnd = startOfMonthUtc(year + 1, 1);
  const openingDate = new Date(account.openingDate);

  const [before, rows] = await Promise.all([
    totalsByDirection(
      liveEntryMatch(account, { entryDate: { $gte: openingDate, $lt: yearStart } }),
    ),
    BankEntry.aggregate([
      {
        $match: {
          account: account._id,
          deletedAt: null,
          entryDate: { $gte: openingDate > yearStart ? openingDate : yearStart, $lt: yearEnd },
        },
      },
      {
        $group: {
          _id: { month: "$month", kind: "$kind" },
          total: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  const byMonth = new Map();
  for (const row of rows) {
    if (!byMonth.has(row._id.month)) byMonth.set(row._id.month, emptyKindRow());
    byMonth.get(row._id.month)[row._id.kind] = toCents(row.total);
  }

  let running = toCents(account.openingBalance) + before.in - before.out;
  const months = [];

  for (let month = 1; month <= 12; month++) {
    if (startOfNextMonthUtc(year, month) <= openingDate) continue;

    const key = `${year}-${String(month).padStart(2, "0")}`;
    const kinds = byMonth.get(key) ?? emptyKindRow();

    const outflows = OUTFLOW_KINDS.reduce((sum, k) => sum + kinds[k], 0);
    const opening = running;
    running += kinds.income + kinds.savings_withdrawal - outflows - kinds.savings_deposit;

    months.push({
      month: key,
      opening: fromCents(opening),
      income: fromCents(kinds.income),
      outflows: fromCents(outflows),
      net: fromCents(kinds.income - outflows),
      savingsDeposited: fromCents(kinds.savings_deposit),
      savingsWithdrawn: fromCents(kinds.savings_withdrawal),
      closing: fromCents(running),
    });
  }

  return { year, months };
}

// ============================================================================
// AUDIT
// ============================================================================

export async function listAuditLogs({ entityId, limit = 100 }) {
  const filter = {};
  if (entityId) {
    if (!mongoose.isValidObjectId(entityId)) {
      throw new ApiError(400, "Invalid entity ID");
    }
    filter.entityId = entityId;
  }

  return BankAuditLog.find(filter)
    .sort({ changedAt: -1 })
    .limit(Math.min(Number(limit) || 100, 200))
    .populate("changedBy", "name role")
    .lean();
}
