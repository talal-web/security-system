"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Landmark, Settings2 } from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { ErrorState, LoadingState } from "@/components/ui/States";

import BankAccountModal from "@/components/bank/BankAccountModal";
import BankEntriesTable from "@/components/bank/BankEntriesTable";
import BankEntryModal from "@/components/bank/BankEntryModal";
import BankMonthSummary from "@/components/bank/BankMonthSummary";
import BankYearChart from "@/components/bank/BankYearChart";
import { formatMonthKey } from "@/components/bank/format";

import {
  useBankAccount,
  useBankMonth,
  useBankYear,
  useDeleteBankEntry,
} from "@/hooks/bank/useBank";

import type { BankEntry, ManualBankEntryKind } from "@/types/bank";

function currentUtcPeriod() {
  const now = new Date();
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
}

const shiftMonth = (year: number, month: number, delta: number) => {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
};

const toKey = (year: number, month: number) =>
  `${year}-${String(month).padStart(2, "0")}`;

export default function BankPage() {
  const [period, setPeriod] = useState(currentUtcPeriod);
  const { year, month } = period;

  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [defaultKind, setDefaultKind] = useState<ManualBankEntryKind>("income");
  const [editingEntry, setEditingEntry] = useState<BankEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<BankEntry | null>(null);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  const account = useBankAccount();
  const monthReport = useBankMonth(year, month);
  const yearReport = useBankYear(year);
  const deleteEntry = useDeleteBankEntry();

  const openNewEntry = (kind: ManualBankEntryKind) => {
    setEditingEntry(null);
    setDefaultKind(kind);
    setEntryModalOpen(true);
  };

  const openEditEntry = (entry: BankEntry) => {
    setEditingEntry(entry);
    setEntryModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingEntry) return;
    try {
      await deleteEntry.mutateAsync(deletingEntry._id);
    } finally {
      setDeletingEntry(null);
    }
  };

  const moveMonth = (delta: number) => setPeriod((p) => shiftMonth(p.year, p.month, delta));

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <PageContainer>
        <PageHeader
          title="Bank & cash flow"
          description="Record money received and money paid out for each month."
          icon={Landmark}
          actions={
            <>
              <Button variant="secondary" onClick={() => setAccountModalOpen(true)} disabled={!account.data}>
                <Settings2 />
                Account setup
              </Button>
              <Button variant="secondary" onClick={() => openNewEntry("expense")}>
                Add payment out
              </Button>
              <Button onClick={() => openNewEntry("income")}>Add income</Button>
            </>
          }
        />

        {account.data && (
          <Card>
            <CardContent className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {account.data.name}
                </p>
                <p className="text-2xl font-semibold tracking-tight text-slate-900">
                  {account.data.currentBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <p className="text-sm text-slate-500">Current bank balance</p>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => moveMonth(-1)}
            aria-label="Previous month"
          >
            <ChevronLeft />
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              {formatMonthKey(year, month)}
            </h2>
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => moveMonth(1)}
            aria-label="Next month"
          >
            <ChevronRight />
          </Button>
        </div>

        {monthReport.isError ? (
          <ErrorState
            title="Could not load this month"
            description={monthReport.error instanceof Error ? monthReport.error.message : undefined}
          />
        ) : monthReport.isLoading ? (
          <LoadingState title="Loading month..." />
        ) : (
          <BankMonthSummary report={monthReport.data} loading={monthReport.isFetching} />
        )}

        <Card>
          <CardHeader title="Entries" description="Edit or remove manual entries. Entries from invoices and payroll are managed from their source." />
          <CardContent className="p-0">
            {monthReport.isLoading ? (
              <LoadingState title="Loading entries..." />
            ) : (
              <BankEntriesTable
                entries={monthReport.data?.entries ?? []}
                onEdit={openEditEntry}
                onDelete={setDeletingEntry}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title={`${year} at a glance`}
            description="Money in and out per month. Select a month to open it."
          />
          <CardContent>
            {yearReport.isLoading ? (
              <LoadingState title="Loading year..." />
            ) : yearReport.isError ? (
              <ErrorState title="Could not load the year" />
            ) : (
              <BankYearChart
                months={yearReport.data?.months ?? []}
                activeMonth={toKey(year, month)}
                onSelect={(key) => {
                  const [y, m] = key.split("-").map(Number);
                  setPeriod({ year: y, month: m });
                }}
              />
            )}
          </CardContent>
        </Card>
      </PageContainer>

      <BankEntryModal
        open={entryModalOpen}
        onClose={() => setEntryModalOpen(false)}
        entry={editingEntry}
        defaultKind={defaultKind}
      />

      {account.data && (
        <BankAccountModal
          open={accountModalOpen}
          onClose={() => setAccountModalOpen(false)}
          account={account.data}
        />
      )}

      <ConfirmationModal
        open={Boolean(deletingEntry)}
        title="Delete this entry?"
        description="The entry is removed from every balance and report. The change is kept in the audit log."
        confirmText="Delete entry"
        isLoading={deleteEntry.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingEntry(null)}
      />
    </ProtectedRoute>
  );
}
