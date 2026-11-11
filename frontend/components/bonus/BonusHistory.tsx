"use client";

import { Gift, Pencil, WalletCards, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";

import type { Bonus } from "@/types/bonus";
import type { StatusTone } from "@/utils/ui/statusColors";

interface BonusHistoryProps {
  bonuses: Bonus[];
  canEdit?: boolean;
  onEdit?: (bonus: Bonus) => void;
  onCancel?: (bonus: Bonus) => void;
}

const statusConfig: Record<Bonus["status"], { label: string; tone: StatusTone }> =
  {
    pending: { label: "Pending", tone: "info" },
    paid: { label: "Paid", tone: "success" },
    cancelled: { label: "Cancelled", tone: "neutral" },
  };

function formatCurrency(value: number) {
  return `Rs. ${value.toLocaleString()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getEmployeeName(bonus: Bonus) {
  if (typeof bonus.employee === "string") {
    return "Employee";
  }

  return bonus.employee.name;
}

function getCreatedBy(bonus: Bonus) {
  if (typeof bonus.createdBy === "string") {
    return "—";
  }

  return bonus.createdBy.name;
}

export default function BonusHistory({
  bonuses,
  canEdit = false,
  onEdit,
  onCancel,
}: BonusHistoryProps) {
  if (!bonuses.length) {
    return (
      <EmptyState
        icon={WalletCards}
        title="No bonus records"
        description="No bonuses have been recorded yet."
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Bonus History"
        description={`${bonuses.length} record${
          bonuses.length !== 1 ? "s" : ""
        }`}
        icon={Gift}
      />

      {/* Desktop / Tablet */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/80 text-left text-xs font-medium text-slate-500">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 font-medium">
                Employee
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">Date</th>
              <th className="whitespace-nowrap px-4 py-3 text-right font-medium">
                Amount
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">
                Reason
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">
                Status
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">
                Created By
              </th>

              {canEdit && (
                <th className="whitespace-nowrap px-4 py-3 text-right font-medium">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 border-t border-slate-100">
            {bonuses.map((bonus) => {
              const config = statusConfig[bonus.status];
              const canModify = bonus.status === "pending";

              return (
                <tr
                  key={bonus._id}
                  className="transition-colors hover:bg-slate-50/60"
                >
                  {/* Employee */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">
                      {getEmployeeName(bonus)}
                    </div>

                    {typeof bonus.employee !== "string" && (
                      <div className="mt-0.5 text-xs text-slate-500">
                        {bonus.employee.fatherName}
                      </div>
                    )}
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {formatDate(bonus.bonusDate)}
                  </td>

                  {/* Amount */}
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-slate-900">
                    {formatCurrency(bonus.amount)}
                  </td>

                  {/* Reason */}
                  <td className="max-w-65 px-4 py-3">
                    <span className="block truncate text-slate-600">
                      {bonus.reason}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Badge tone={config.tone} dot>
                      {config.label}
                    </Badge>
                  </td>

                  {/* Created By */}
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {getCreatedBy(bonus)}
                  </td>

                  {/* Actions */}
                  {canEdit && (
                    <td className="px-4 py-3">
                      {canModify && (
                        <div className="flex justify-end gap-2">
                          {onEdit && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => onEdit(bonus)}
                            >
                              <Pencil />
                              Edit
                            </Button>
                          )}

                          {onCancel && (
                            <Button
                              variant="danger-soft"
                              size="sm"
                              onClick={() => onCancel(bonus)}
                            >
                              <XCircle />
                              Cancel
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="divide-y divide-slate-100 md:hidden">
        {bonuses.map((bonus) => {
          const config = statusConfig[bonus.status];
          const canModify = bonus.status === "pending";

          return (
            <article key={bonus._id} className="p-4">
              {/* Employee / Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-slate-900">
                    {getEmployeeName(bonus)}
                  </h3>

                  {typeof bonus.employee !== "string" && (
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {bonus.employee.fatherName}
                    </p>
                  )}
                </div>

                <Badge tone={config.tone} dot className="shrink-0">
                  {config.label}
                </Badge>
              </div>

              {/* Details */}
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                <div className="min-w-0">
                  <dt className="text-xs text-slate-500">Bonus</dt>
                  <dd className="mt-0.5 truncate text-sm font-semibold tabular-nums text-slate-900">
                    {formatCurrency(bonus.amount)}
                  </dd>
                </div>

                <div className="min-w-0">
                  <dt className="text-xs text-slate-500">Date</dt>
                  <dd className="mt-0.5 truncate text-sm text-slate-700">
                    {formatDate(bonus.bonusDate)}
                  </dd>
                </div>
              </dl>

              {/* Reason */}
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">Reason</p>

                <p className="mt-0.5 break-words text-sm leading-5 text-slate-700">
                  {bonus.reason}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-xs text-slate-500">
                  Created by{" "}
                  <span className="font-medium text-slate-700">
                    {getCreatedBy(bonus)}
                  </span>
                </p>

                {canEdit && canModify && (
                  <div className="flex shrink-0 gap-2">
                    {onEdit && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(bonus)}
                      >
                        <Pencil />
                        Edit
                      </Button>
                    )}

                    {onCancel && (
                      <Button
                        variant="danger-soft"
                        size="sm"
                        onClick={() => onCancel(bonus)}
                      >
                        <XCircle />
                        Cancel
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}
