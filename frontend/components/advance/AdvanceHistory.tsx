"use client";

import { CircleDollarSign, Pencil, UserRound, XCircle } from "lucide-react";

import AdvanceHistoryMobileCard from "./AdvanceHistoryMobileCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";

import type { Advance } from "@/types/advance";
import type { StatusTone } from "@/utils/ui/statusColors";

interface AdvanceHistoryProps {
  advances: Advance[];
  canEdit?: boolean;
  onEdit?: (advance: Advance) => void;
  onCancel?: (advance: Advance) => void;
}

const statusConfig: Record<
  Advance["status"],
  { label: string; tone: StatusTone }
> = {
  active: { label: "Active", tone: "info" },
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

function getEmployeeName(advance: Advance) {
  if (typeof advance.employee === "string") {
    return "Employee";
  }

  return advance.employee.name;
}

function getCreatedBy(advance: Advance) {
  if (typeof advance.createdBy === "string") {
    return "—";
  }

  return advance.createdBy.name;
}

export default function AdvanceHistory({
  advances,
  canEdit = false,
  onEdit,
  onCancel,
}: AdvanceHistoryProps) {
  if (!advances.length) {
    return (
      <EmptyState
        icon={UserRound}
        title="No advance records"
        description="No advance has been recorded for this employee yet."
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Advance History"
        description={`${advances.length} record${
          advances.length !== 1 ? "s" : ""
        }`}
        icon={CircleDollarSign}
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
                Advance
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-right font-medium">
                Deducted
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-right font-medium">
                Remaining
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
            {advances.map((advance) => {
              const deductedAmount = advance.amount - advance.remainingAmount;

              const config =
                statusConfig[advance.status] ?? statusConfig.cancelled;

              const canModify =
                advance.status === "active" &&
                advance.remainingAmount === advance.amount;

              return (
                <tr
                  key={advance._id}
                  className="transition-colors hover:bg-slate-50/60"
                >
                  {/* Employee */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">
                      {getEmployeeName(advance)}
                    </div>

                    {typeof advance.employee !== "string" && (
                      <div className="mt-0.5 text-xs text-slate-500">
                        {advance.employee.fatherName}
                      </div>
                    )}
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {formatDate(advance.advanceDate)}
                  </td>

                  {/* Advance */}
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-slate-900">
                    {formatCurrency(advance.amount)}
                  </td>

                  {/* Deducted */}
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-600">
                    {formatCurrency(deductedAmount)}
                  </td>

                  {/* Remaining */}
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-slate-900">
                    {formatCurrency(advance.remainingAmount)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Badge tone={config.tone} dot>
                      {config.label}
                    </Badge>
                  </td>

                  {/* Created By */}
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {getCreatedBy(advance)}
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
                              onClick={() => onEdit(advance)}
                            >
                              <Pencil />
                              Edit
                            </Button>
                          )}

                          {onCancel && (
                            <Button
                              variant="danger-soft"
                              size="sm"
                              onClick={() => onCancel(advance)}
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
        {advances.map((advance) => (
          <AdvanceHistoryMobileCard
            key={advance._id}
            advance={advance}
            canEdit={canEdit}
            onEdit={onEdit}
            onCancel={onCancel}
          />
        ))}
      </div>
    </Card>
  );
}
