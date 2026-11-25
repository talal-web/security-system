export type BankEntryKind =
  | "income"
  | "rent"
  | "expense"
  | "advance"
  | "salary"
  | "savings_deposit"
  | "savings_withdrawal";

export type BankDirection = "in" | "out";

export interface BankEntryEmployee {
  _id: string;
  name: string;
  empId: string;
}

export interface BankEntry {
  _id: string;
  account: string;
  kind: BankEntryKind;
  direction: BankDirection;
  amount: number;
  entryDate: string;
  month: string;
  category: string;
  description: string;
  employee: BankEntryEmployee | string | null;
  source: {
    kind: "Invoice" | "Payroll" | "Bonus" | "Advance" | null;
    refId: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccountSummary {
  id: string;
  name: string;
  openingBalance: number;
  openingDate: string;
  currentBalance: number;
  savingsBalance: number;
}

export type BankOutflowTotals = {
  rent: number;
  expense: number;
  advance: number;
  salary: number;
};

export interface BankMonthReport {
  year: number;
  month: number;
  opening: number;
  totals: {
    income: number;
    outflows: BankOutflowTotals;
    totalOutflows: number;
    net: number;
    savingsDeposited: number;
    savingsWithdrawn: number;
  };
  closing: number;
  savingsBalance: number;
  entries: BankEntry[];
}

export interface BankYearMonth {
  month: string;
  opening: number;
  income: number;
  outflows: number;
  net: number;
  savingsDeposited: number;
  savingsWithdrawn: number;
  closing: number;
}

export interface BankYearReport {
  year: number;
  months: BankYearMonth[];
}

// Manual entries only. Advances and salaries come from the Advances and Payroll pages.
export type ManualBankEntryKind = Exclude<BankEntryKind, "advance" | "salary">;

export interface CreateBankEntryPayload {
  kind: ManualBankEntryKind;
  amount: number;
  entryDate: string; // YYYY-MM-DD
  category?: string;
  description?: string;
}

export type UpdateBankEntryPayload = Partial<CreateBankEntryPayload>;

export interface UpdateBankAccountPayload {
  name?: string;
  openingBalance?: number;
  openingDate?: string; // YYYY-MM-DD, first day of a month
}

export const BANK_KIND_LABELS: Record<BankEntryKind, string> = {
  income: "Income received",
  rent: "Rent",
  expense: "Expense",
  advance: "Employee advance",
  salary: "Salary (cash)",
  savings_deposit: "Move to savings",
  savings_withdrawal: "Withdraw from savings",
};

export const OUTFLOW_KINDS: BankEntryKind[] = [
  "rent",
  "expense",
  "savings_deposit",
];
