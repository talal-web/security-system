"use client";

import {
  CircleDollarSign,
  ClipboardMinus,
  Pencil,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";

import type { Deduction } from "@/types/deduction";
import type { StatusTone } from "@/utils/ui/statusColors";

interface DeductionHistoryProps {
  deductions: Deduction[];
  canEdit?: boolean;
  onEdit?: (deduction: Deduction) => void;
  onCancel?: (deduction: Deduction) => void;
}

const statusConfig: Record<
  Deduction["status"],
  { label: string; tone: StatusTone }
> = {
  pending: { label: "Pending", tone: "info" },
  partially_deducted: { label: "Partially Deducted", tone: "warning" },
  fully_deducted: { label: "Fully Deducted", tone: "success" },
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

function getEmployeeName(deduction: Deduction) {
  if (typeof deduction.employee === "string") {
    return "Employee";
  }

  return deduction.employee.name;
}

function getCreatedBy(deduction: Deduction) {
  if (typeof deduction.createdBy === "string") {
    return "—";
  }

  return deduction.createdBy.name;
}

export default function DeductionHistory({
  deductions,
  canEdit = false,
  onEdit,
  onCancel,
}: DeductionHistoryProps) {
  if (!deductions.length) {
    return (
      <EmptyState
        icon={CircleDollarSign}
        title="No deduction records"
        description="No deductions have been recorded yet."
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Deduction History"
        description={`${deductions.length} record${
          deductions.length !== 1 ? "s" : ""
        }`}
        icon={ClipboardMinus}
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
                Deduction
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-right font-medium">
                Deducted
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-right font-medium">
                Remaining
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
            {deductions.map((deduction) => {
              const deductedAmount =
                deduction.amount - deduction.remainingAmount;

              const config = statusConfig[deduction.status];

              const canModify =
                deduction.status === "pending" &&
                deduction.remainingAmount === deduction.amount;

              return (
                <tr
                  key={deduction._id}
                  className="transition-colors hover:bg-slate-50/60"
                >
                  {/* Employee */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">
                      {getEmployeeName(deduction)}
                    </div>

                    {typeof deduction.employee !== "string" && (
                      <div className="mt-0.5 text-xs text-slate-500">
                        {deduction.employee.fatherName}
                      </div>
                    )}
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {formatDate(deduction.deductionDate)}
                  </td>

                  {/* Original amount */}
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-slate-900">
                    {formatCurrency(deduction.amount)}
                  </td>

                  {/* Deducted */}
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-600">
                    {formatCurrency(deductedAmount)}
                  </td>

                  {/* Remaining */}
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-slate-900">
                    {formatCurrency(deduction.remainingAmount)}
                  </td>

                  {/* Reason */}
                  <td className="max-w-60 px-4 py-3">
                    <span className="block truncate text-slate-600">
                      {deduction.reason}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Badge tone={config.tone} dot>
                      {config.label}
                    </Badge>
                  </td>

                  {/* Creator */}
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {getCreatedBy(deduction)}
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
                              onClick={() => onEdit(deduction)}
                            >
                              <Pencil />
                              Edit
                            </Button>
                          )}

                          {onCancel && (
                            <Button
                              variant="danger-soft"
                              size="sm"
                              onClick={() => onCancel(deduction)}
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
        {deductions.map((deduction) => {
          const deductedAmount = deduction.amount - deduction.remainingAmount;

          const config = statusConfig[deduction.status];

          const canModify =
            deduction.status === "pending" &&
            deduction.remainingAmount === deduction.amount;

          return (
            <article key={deduction._id} className="p-4">
              {/* Employee / Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-slate-900">
                    {getEmployeeName(deduction)}
                  </h3>

                  {typeof deduction.employee !== "string" && (
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {deduction.employee.fatherName}
                    </p>
                  )}
                </div>

                <Badge tone={config.tone} dot className="shrink-0">
                  {config.label}
                </Badge>
              </div>

              {/* Financial details */}
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                <div className="min-w-0">
                  <dt className="text-xs text-slate-500">Deduction</dt>
                  <dd className="mt-0.5 truncate text-sm font-semibold tabular-nums text-slate-900">
                    {formatCurrency(deduction.amount)}
                  </dd>
                </div>

                <div className="min-w-0">
                  <dt className="text-xs text-slate-500">Remaining</dt>
                  <dd className="mt-0.5 truncate text-sm font-semibold tabular-nums text-slate-900">
                    {formatCurrency(deduction.remainingAmount)}
                  </dd>
                </div>

                <div className="min-w-0">
                  <dt className="text-xs text-slate-500">Deducted</dt>
                  <dd className="mt-0.5 truncate text-sm tabular-nums text-slate-700">
                    {formatCurrency(deductedAmount)}
                  </dd>
                </div>

                <div className="min-w-0">
                  <dt className="text-xs text-slate-500">Date</dt>
                  <dd className="mt-0.5 truncate text-sm text-slate-700">
                    {formatDate(deduction.deductionDate)}
                  </dd>
                </div>
              </dl>

              {/* Reason */}
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">Reason</p>

                <p className="mt-0.5 break-words text-sm leading-5 text-slate-700">
                  {deduction.reason}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-xs text-slate-500">
                  Created by{" "}
                  <span className="font-medium text-slate-700">
                    {getCreatedBy(deduction)}
                  </span>
                </p>

                {canEdit && canModify && (
                  <div className="flex shrink-0 gap-2">
                    {onEdit && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(deduction)}
                      >
                        <Pencil />
                        Edit
                      </Button>
                    )}

                    {onCancel && (
                      <Button
                        variant="danger-soft"
                        size="sm"
                        onClick={() => onCancel(deduction)}
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
