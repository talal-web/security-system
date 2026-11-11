"use client";

import { Pencil, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

import type { Advance } from "@/types/advance";
import type { StatusTone } from "@/utils/ui/statusColors";

interface AdvanceHistoryMobileCardProps {
  advance: Advance;
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

export default function AdvanceHistoryMobileCard({
  advance,
  canEdit = false,
  onEdit,
  onCancel,
}: AdvanceHistoryMobileCardProps) {
  const deductedAmount = advance.amount - advance.remainingAmount;

  const config = statusConfig[advance.status] ?? statusConfig.cancelled;

  const canModify =
    advance.status === "active" && advance.remainingAmount === advance.amount;

  return (
    <article className="p-4">
      {/* Employee / Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {getEmployeeName(advance)}
          </h3>

          {typeof advance.employee !== "string" &&
            advance.employee.fatherName && (
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {advance.employee.fatherName}
              </p>
            )}
        </div>

        <Badge tone={config.tone} dot className="shrink-0">
          {config.label}
        </Badge>
      </div>

      {/* Financial Summary */}
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3">
        <div className="min-w-0">
          <dt className="text-xs text-slate-500">Advance</dt>
          <dd className="mt-0.5 truncate text-sm font-semibold tabular-nums text-slate-900">
            {formatCurrency(advance.amount)}
          </dd>
        </div>

        <div className="min-w-0">
          <dt className="text-xs text-slate-500">Remaining</dt>
          <dd className="mt-0.5 truncate text-sm font-semibold tabular-nums text-slate-900">
            {formatCurrency(advance.remainingAmount)}
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
            {formatDate(advance.advanceDate)}
          </dd>
        </div>
      </dl>

      {/* Description */}
      {advance.description && (
        <div className="mt-3">
          <p className="text-xs font-medium text-slate-500">Description</p>

          <p className="mt-0.5 break-words text-sm leading-5 text-slate-700">
            {advance.description}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-xs text-slate-500">
          Created by{" "}
          <span className="font-medium text-slate-700">
            {getCreatedBy(advance)}
          </span>
        </p>

        {canEdit && canModify && (
          <div className="flex shrink-0 gap-2">
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(advance)}
                aria-label="Edit advance"
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
                aria-label="Cancel advance"
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
}
