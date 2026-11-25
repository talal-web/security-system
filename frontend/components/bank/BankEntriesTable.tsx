"use client";

import { Pencil, Trash2, Lock } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { formatDay, formatMoney } from "@/components/bank/format";
import { BANK_KIND_LABELS, type BankEntry } from "@/types/bank";

interface BankEntriesTableProps {
  entries: BankEntry[];
  onEdit: (entry: BankEntry) => void;
  onDelete: (entry: BankEntry) => void;
}

const SOURCE_LABELS: Record<string, string> = {
  Invoice: "From invoice",
  Payroll: "From payroll",
};

export default function BankEntriesTable({
  entries,
  onEdit,
  onDelete,
}: BankEntriesTableProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        title="No bank entries this month"
        description="Record income as it is received, and expenses, rent, advances and savings as they are paid."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-2.5">Date</th>
            <th className="px-4 py-2.5">Type</th>
            <th className="px-4 py-2.5">Details</th>
            <th className="px-4 py-2.5 text-right">In</th>
            <th className="px-4 py-2.5 text-right">Out</th>
            <th className="px-4 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {entries.map((entry) => {
            const locked = Boolean(entry.source?.kind);
            const employeeName =
              entry.employee && typeof entry.employee === "object"
                ? entry.employee.name
                : null;

            return (
              <tr key={entry._id} className="hover:bg-slate-50/70">
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                  {formatDay(entry.entryDate)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-900">
                  {BANK_KIND_LABELS[entry.kind]}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <div className="flex flex-col">
                    {employeeName && <span>{employeeName}</span>}
                    {entry.category && <span>{entry.category}</span>}
                    {entry.description && (
                      <span className="text-xs text-slate-500">{entry.description}</span>
                    )}
                    {locked && (
                      <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500">
                        <Lock className="size-3" />
                        {SOURCE_LABELS[entry.source!.kind!] ?? "Automatic"}
                      </span>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-emerald-700">
                  {entry.direction === "in" ? formatMoney(entry.amount) : ""}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-red-700">
                  {entry.direction === "out" ? formatMoney(entry.amount) : ""}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  {locked ? (
                    <span className="text-xs text-slate-400">Managed on source</span>
                  ) : (
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(entry)}
                        aria-label="Edit entry"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDelete(entry)}
                        aria-label="Delete entry"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
