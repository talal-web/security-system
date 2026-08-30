"use client";

import { useState } from "react";
import { CalendarDays, Eye, Pencil, UserRound, X, XCircle } from "lucide-react";

import type { Fine } from "@/types/fine";

interface FineHistoryProps {
  fines: Fine[];
  canEdit?: boolean;
  onEdit?: (fine: Fine) => void;
  onCancel?: (fine: Fine) => void;
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-blue-50 text-blue-700",
  },
  partially_deducted: {
    label: "Partially Deducted",
    className: "bg-amber-50 text-amber-700",
  },
  fully_deducted: {
    label: "Fully Deducted",
    className: "bg-emerald-50 text-emerald-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-600",
  },
} as const;

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
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <XCircle className="h-5 w-5 text-gray-500" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-gray-900">
          No fine records
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          No fines have been recorded yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="flex flex-col gap-1 border-b border-gray-200 px-4 py-4 sm:px-6">
          <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
            Fine History
          </h2>

          <p className="text-xs text-gray-500 sm:text-sm">
            {fines.length} record{fines.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ===================================================== */}
        {/* DESKTOP TABLE */}
        {/* ===================================================== */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-262.5 text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                <th className="whitespace-nowrap px-5 py-3">Employee</th>

                <th className="whitespace-nowrap px-4 py-3">Date</th>

                <th className="whitespace-nowrap px-4 py-3 text-right">Fine</th>

                <th className="whitespace-nowrap px-4 py-3 text-right">
                  Deducted
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-right">
                  Remaining
                </th>

                <th className="whitespace-nowrap px-4 py-3">Reason</th>

                <th className="whitespace-nowrap px-4 py-3">Status</th>

                <th className="whitespace-nowrap px-4 py-3">Created By</th>

                {canEdit && (
                  <th className="whitespace-nowrap px-5 py-3 text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {fines.map((fine) => {
                const deducted = fine.amount - fine.remainingAmount;
                const config = statusConfig[fine.status];

                const canModify =
                  fine.status === "pending" &&
                  fine.remainingAmount === fine.amount;

                return (
                  <tr
                    key={fine._id}
                    className="transition-colors hover:bg-gray-50/70"
                  >
                    {/* Employee */}
                    <td className="px-5 py-3.5">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">
                          {getEmployeeName(fine)}
                        </p>

                        {typeof fine.employee !== "string" && (
                          <>
                            <p className="mt-0.5 text-xs text-gray-500">
                              {fine.employee.empId}
                            </p>

                            <p className="truncate text-xs text-gray-400">
                              {fine.employee.fatherName}
                            </p>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-4 py-3.5 text-gray-600">
                      {formatDate(fine.fineDate)}
                    </td>

                    {/* Fine */}
                    <td className="whitespace-nowrap px-4 py-3.5 text-right font-semibold text-gray-900">
                      {formatCurrency(fine.amount)}
                    </td>

                    {/* Deducted */}
                    <td className="whitespace-nowrap px-4 py-3.5 text-right text-gray-600">
                      {formatCurrency(deducted)}
                    </td>

                    {/* Remaining */}
                    <td className="whitespace-nowrap px-4 py-3.5 text-right font-semibold text-gray-900">
                      {formatCurrency(fine.remainingAmount)}
                    </td>

                    {/* Reason */}
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => setSelectedReason(fine.reason)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Reason
                      </button>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
                      >
                        {config.label}
                      </span>
                    </td>

                    {/* Created By */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 whitespace-nowrap text-gray-700">
                        <UserRound className="h-3.5 w-3.5 text-gray-400" />

                        <span className="text-xs font-medium">
                          {getCreatedByName(fine)}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    {canEdit && (
                      <td className="px-5 py-3.5">
                        {canModify && (
                          <div className="flex justify-end gap-1.5">
                            {onEdit && (
                              <button
                                type="button"
                                onClick={() => onEdit(fine)}
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </button>
                            )}

                            {onCancel && (
                              <button
                                type="button"
                                onClick={() => onCancel(fine)}
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-200 px-2.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Cancel
                              </button>
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

        {/* ===================================================== */}
        {/* MOBILE CARDS */}
        {/* ===================================================== */}

        <div className="divide-y divide-gray-100 md:hidden">
          {fines.map((fine) => {
            const deducted = fine.amount - fine.remainingAmount;
            const config = statusConfig[fine.status];

            const canModify =
              fine.status === "pending" && fine.remainingAmount === fine.amount;

            return (
              <article key={fine._id} className="p-4 sm:p-5">
                {/* Employee / Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-gray-900">
                      {getEmployeeName(fine)}
                    </h3>

                    {typeof fine.employee !== "string" && (
                      <div className="mt-1 space-y-0.5">
                        <p className="text-xs text-gray-500">
                          {fine.employee.empId}
                        </p>

                        <p className="truncate text-xs text-gray-400">
                          {fine.employee.fatherName}
                        </p>
                      </div>
                    )}
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${config.className}`}
                  >
                    {config.label}
                  </span>
                </div>

                {/* Financial Summary */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                    <p className="text-[11px] font-medium text-gray-500">
                      Fine
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatCurrency(fine.amount)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                    <p className="text-[11px] font-medium text-gray-500">
                      Deducted
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatCurrency(deducted)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                    <p className="text-[11px] font-medium text-gray-500">
                      Remaining
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatCurrency(fine.remainingAmount)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                    <p className="text-[11px] font-medium text-gray-500">
                      Fine Date
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatDate(fine.fineDate)}
                    </p>
                  </div>
                </div>

                {/* Meta */}
                <div className="mt-3 flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Created By */}
                  <div className="flex min-w-0 items-center gap-2">
                    <UserRound className="h-4 w-4 shrink-0 text-gray-400" />

                    <div className="min-w-0">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                        Created By
                      </p>

                      <p className="truncate text-xs font-semibold text-gray-700">
                        {getCreatedByName(fine)}
                      </p>
                    </div>
                  </div>

                  {/* View Reason */}
                  <button
                    type="button"
                    onClick={() => setSelectedReason(fine.reason)}
                    className="inline-flex h-8 w-full shrink-0 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Reason
                  </button>
                </div>

                {/* Actions */}
                {canEdit && canModify && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(fine)}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    )}

                    {onCancel && (
                      <button
                        type="button"
                        onClick={() => onCancel(fine)}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Cancel
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* ===================================================== */}
      {/* REASON MODAL */}
      {/* ===================================================== */}

      {selectedReason !== null && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedReason(null);
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3.5 sm:px-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Fine Reason
                  </h3>

                  <p className="text-xs text-gray-500">Reason for this fine</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReason(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close reason"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-5">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-gray-700">
                  {selectedReason || "No reason provided."}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-5">
              <button
                type="button"
                onClick={() => setSelectedReason(null)}
                className="h-9 w-full rounded-lg bg-gray-900 px-4 text-xs font-semibold text-white transition hover:bg-gray-800 sm:w-auto sm:min-w-20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
