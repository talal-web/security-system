"use client";

import { useState } from "react";
import { Eye, Gavel, Pencil, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/States";

import type { Fine } from "@/types/fine";
import type { StatusTone } from "@/utils/ui/statusColors";

interface FineHistoryProps {
  fines: Fine[];
  canEdit?: boolean;
  onEdit?: (fine: Fine) => void;
  onCancel?: (fine: Fine) => void;
}

const statusConfig: Record<Fine["status"], { label: string; tone: StatusTone }> =
  {
    pending: { label: "Pending", tone: "info" },
    partially_deducted: { label: "Partially Deducted", tone: "warning" },
    fully_deducted: { label: "Fully Deducted", tone: "success" },
    cancelled: { label: "Cancelled", tone: "neutral" },
  };

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return `Rs. ${value.toLocaleString()}`;
}

function getEmployeeName(fine: Fine) {
  if (typeof fine.employee === "string") {
    return "Employee";
  }

  return fine.employee?.name || "Employee";
}

function getCreatedByName(fine: Fine) {
  if (!fine.createdBy || typeof fine.createdBy === "string") {
    return "—";
  }

  return fine.createdBy.name || "—";
}

export default function FineHistory({
  fines,
  canEdit = false,
  onEdit,
  onCancel,
}: FineHistoryProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  if (!fines.length) {
    return (
      <EmptyState
        icon={XCircle}
        title="No fine records"
        description="No fines have been recorded yet."
      />
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader
          title="Fine History"
          description={`${fines.length} record${fines.length !== 1 ? "s" : ""}`}
          icon={Gavel}
        />

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-262.5 text-sm">
            <thead className="bg-slate-50/80 text-left text-xs font-medium text-slate-500">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-medium">
                  Employee
                </th>

                <th className="whitespace-nowrap px-4 py-3 font-medium">
                  Date
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-right font-medium">
                  Fine
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
              {fines.map((fine) => {
                const deducted = fine.amount - fine.remainingAmount;
                const config = statusConfig[fine.status];

                const canModify =
                  fine.status === "pending" &&
                  fine.remainingAmount === fine.amount;

                return (
                  <tr
                    key={fine._id}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    {/* Employee */}
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">
                          {getEmployeeName(fine)}
                        </p>

                        {typeof fine.employee !== "string" && (
                          <>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {fine.employee.empId}
                            </p>

                            <p className="truncate text-xs text-slate-400">
                              {fine.employee.fatherName}
                            </p>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {formatDate(fine.fineDate)}
                    </td>

                    {/* Fine */}
                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-slate-900">
                      {formatCurrency(fine.amount)}
                    </td>

                    {/* Deducted */}
                    <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-600">
                      {formatCurrency(deducted)}
                    </td>

                    {/* Remaining */}
                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-slate-900">
                      {formatCurrency(fine.remainingAmount)}
                    </td>

                    {/* Reason */}
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedReason(fine.reason)}
                        className="-ml-2"
                      >
                        <Eye />
                        View Reason
                      </Button>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <Badge tone={config.tone} dot>
                        {config.label}
                      </Badge>
                    </td>

                    {/* Created By */}
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {getCreatedByName(fine)}
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
                                onClick={() => onEdit(fine)}
                              >
                                <Pencil />
                                Edit
                              </Button>
                            )}

                            {onCancel && (
                              <Button
                                variant="danger-soft"
                                size="sm"
                                onClick={() => onCancel(fine)}
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

        {/* Mobile cards */}
        <div className="divide-y divide-slate-100 md:hidden">
          {fines.map((fine) => {
            const deducted = fine.amount - fine.remainingAmount;
            const config = statusConfig[fine.status];

            const canModify =
              fine.status === "pending" && fine.remainingAmount === fine.amount;

            return (
              <article key={fine._id} className="p-4">
                {/* Employee / Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {getEmployeeName(fine)}
                    </h3>

                    {typeof fine.employee !== "string" && (
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {fine.employee.empId}
                        {fine.employee.fatherName && (
                          <> · {fine.employee.fatherName}</>
                        )}
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
                    <dt className="text-xs text-slate-500">Fine</dt>
                    <dd className="mt-0.5 truncate text-sm font-semibold tabular-nums text-slate-900">
                      {formatCurrency(fine.amount)}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-xs text-slate-500">Remaining</dt>
                    <dd className="mt-0.5 truncate text-sm font-semibold tabular-nums text-slate-900">
                      {formatCurrency(fine.remainingAmount)}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-xs text-slate-500">Deducted</dt>
                    <dd className="mt-0.5 truncate text-sm tabular-nums text-slate-700">
                      {formatCurrency(deducted)}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-xs text-slate-500">Fine Date</dt>
                    <dd className="mt-0.5 truncate text-sm text-slate-700">
                      {formatDate(fine.fineDate)}
                    </dd>
                  </div>
                </dl>

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-xs text-slate-500">
                    Created by{" "}
                    <span className="font-medium text-slate-700">
                      {getCreatedByName(fine)}
                    </span>
                  </p>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedReason(fine.reason)}
                    className="-mr-2"
                  >
                    <Eye />
                    View Reason
                  </Button>
                </div>

                {/* Actions */}
                {canEdit && canModify && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {onEdit && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(fine)}
                      >
                        <Pencil />
                        Edit
                      </Button>
                    )}

                    {onCancel && (
                      <Button
                        variant="danger-soft"
                        size="sm"
                        onClick={() => onCancel(fine)}
                      >
                        <XCircle />
                        Cancel
                      </Button>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </Card>

      {/* Reason modal */}
      <Modal
        open={selectedReason !== null}
        onClose={() => setSelectedReason(null)}
        title="Fine Reason"
        contentClassName="p-0"
      >
        <div className="space-y-3 px-5 py-4 sm:px-6">
          <p className="text-xs text-slate-500">Reason for this fine</p>

          <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
            <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-700">
              {selectedReason || "No reason provided."}
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 bg-slate-50/60 px-5 py-3 sm:px-6">
          <Button
            variant="secondary"
            onClick={() => setSelectedReason(null)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
