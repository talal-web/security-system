"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  CalendarDays,
  FileText,
  Gavel,
  Loader2,
  Search,
  UserRound,
  X,
} from "lucide-react";

import { useCreateFine, useUpdateFine } from "@/hooks/fine/useFine";
import { lookupEmployee } from "@/services/employee.service";
import { formatText } from "@/utils/employee/employeeFormat";

import type { CreateFinePayload, Fine } from "@/types/fine";
import type { EmployeeLookupResult } from "@/types/employee";

interface FineFormProps {
  employeeId?: string;
  fine?: Fine | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function FineForm({
  employeeId = "",
  fine = null,
  onSuccess,
  onCancel,
}: FineFormProps) {
  const isEditing = Boolean(fine);

  const createFineMutation = useCreateFine();
  const updateFineMutation = useUpdateFine(employeeId);

  // ======================================
  // Initial employee
  // ======================================

  const editingEmployee =
    fine && typeof fine.employee === "object"
      ? (fine.employee as EmployeeLookupResult)
      : null;

  const initialEmployeeId =
    employeeId ||
    (fine
      ? typeof fine.employee === "string"
        ? fine.employee
        : fine.employee._id
      : "");

  // ======================================
  // Form state
  // ======================================

  const [amount, setAmount] = useState(fine?.amount?.toString() ?? "");

  const [fineDate, setFineDate] = useState(
    fine?.fineDate
      ? fine.fineDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );

  const [reason, setReason] = useState(fine?.reason ?? "");

  const [selectedEmployeeId, setSelectedEmployeeId] =
    useState(initialEmployeeId);

  const [searchEmpId, setSearchEmpId] = useState("");

  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeLookupResult | null>(editingEmployee);

  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [formError, setFormError] = useState("");

  const isPending =
    createFineMutation.isPending || updateFineMutation.isPending;

  const apiError =
    createFineMutation.error?.message ||
    updateFineMutation.error?.message ||
    "";

  // ======================================
  // Employee lookup
  // ======================================

  const handleLookup = async () => {
    const trimmed = searchEmpId.trim();

    if (!trimmed) {
      setLookupError("Please enter an Employee ID (e.g. BSS-0001).");
      return;
    }

    setLookupLoading(true);
    setLookupError("");
    setFormError("");

    try {
      const employee = await lookupEmployee(trimmed);

      setSelectedEmployee(employee);
      setSelectedEmployeeId(employee._id);

      if (employee.status !== "active") {
        setLookupError(
          "This employee is inactive. Fines can only be created for active employees.",
        );
      }
    } catch (error) {
      setSelectedEmployee(null);
      setSelectedEmployeeId("");

      setLookupError(
        error instanceof Error ? error.message : "Employee not found.",
      );
    } finally {
      setLookupLoading(false);
    }
  };

  const handleClearSelectedEmployee = () => {
    setSelectedEmployee(null);
    setSelectedEmployeeId("");
    setSearchEmpId("");
    setLookupError("");
    setFormError("");
  };

  // ======================================
  // Submit
  // ======================================

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormError("");

    const parsedAmount = Number(amount);

    if (
      !amount ||
      !Number.isFinite(parsedAmount) ||
      !Number.isInteger(parsedAmount) ||
      parsedAmount <= 0
    ) {
      setFormError("Enter a valid whole amount greater than zero.");
      return;
    }

    if (!fineDate) {
      setFormError("Please select a fine date.");
      return;
    }

    if (!reason.trim()) {
      setFormError("Fine reason is required.");
      return;
    }

    if (!isEditing && !selectedEmployeeId) {
      setFormError("Please search and select an employee.");
      return;
    }

    if (
      !isEditing &&
      selectedEmployee &&
      selectedEmployee.status !== "active"
    ) {
      setFormError("Fine can only be created for an active employee.");
      return;
    }

    // ======================================
    // Correct existing fine
    // ======================================

    if (isEditing && fine) {
      updateFineMutation.mutate(
        {
          fineId: fine._id,
          data: {
            amount: parsedAmount,
            fineDate,
            reason: reason.trim(),
          },
        },
        {
          onSuccess: () => {
            toast.success("Fine corrected successfully.");
            onSuccess();
          },
        },
      );

      return;
    }

    // ======================================
    // Create new fine
    // ======================================

    const payload: CreateFinePayload = {
      employee: selectedEmployeeId,
      amount: parsedAmount,
      fineDate,
      reason: reason.trim(),
    };

    createFineMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Fine created successfully.");
        onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ======================================
          Errors
      ====================================== */}

      {(formError || apiError) && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

          <p>{formError || apiError}</p>
        </div>
      )}

      {/* ======================================
          Employee
      ====================================== */}

      <div>
        {/* Edit mode */}
        {isEditing && editingEmployee && (
          <>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <UserRound className="h-4 w-4 text-gray-400" />
              Employee
            </label>

            <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {editingEmployee.name}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {editingEmployee.empId} · {editingEmployee.fatherName} ·{" "}
                    {formatText(editingEmployee.designation)}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    editingEmployee.status === "active"
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                      : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                  }`}
                >
                  {editingEmployee.status}
                </span>
              </div>
            </div>
          </>
        )}

        {/* Global create mode */}
        {!isEditing && !employeeId && (
          <>
            <label
              htmlFor="fine-empId-lookup"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <UserRound className="h-4 w-4 text-gray-400" />
              Employee
            </label>

            {selectedEmployee ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedEmployee.name}
                      </p>

                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                          selectedEmployee.status === "active"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                            : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                        }`}
                      >
                        {selectedEmployee.status}
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      ID:{" "}
                      <span className="font-medium text-gray-700">
                        {selectedEmployee.empId}
                      </span>{" "}
                      · Father:{" "}
                      <span className="font-medium text-gray-700">
                        {selectedEmployee.fatherName}
                      </span>{" "}
                      · Designation:{" "}
                      <span className="font-medium text-gray-700">
                        {formatText(selectedEmployee.designation)}
                      </span>
                    </p>
                  </div>

                  {!isPending && (
                    <button
                      type="button"
                      onClick={handleClearSelectedEmployee}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
                    >
                      <X className="h-3 w-3" />
                      Change
                    </button>
                  )}
                </div>

                {selectedEmployee.status !== "active" && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-red-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />

                    <span>
                      Fine cannot be created for an inactive employee.
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                      id="fine-empId-lookup"
                      type="text"
                      value={searchEmpId}
                      onChange={(event) => {
                        setSearchEmpId(event.target.value);
                        setLookupError("");
                        setFormError("");
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleLookup();
                        }
                      }}
                      disabled={isPending || lookupLoading}
                      placeholder="Employee ID (e.g. BSS-0001)"
                      className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleLookup}
                    disabled={isPending || lookupLoading || !searchEmpId.trim()}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {lookupLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">Searching...</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        <span>Lookup</span>
                      </>
                    )}
                  </button>
                </div>

                {lookupError && (
                  <p className="mt-1.5 text-xs text-red-600">{lookupError}</p>
                )}

                <p className="mt-1.5 text-xs leading-5 text-gray-500">
                  Search by Employee ID to select the employee.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ======================================
          Amount + Date
      ====================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="fine-amount"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <Gavel className="h-4 w-4 text-gray-400" />
            Fine Amount
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
              Rs.
            </span>

            <input
              id="fine-amount"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setFormError("");
              }}
              required
              disabled={isPending}
              inputMode="numeric"
              placeholder="5,000"
              className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-11 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>

          <p className="mt-1.5 text-xs text-gray-500">
            Enter the fine in whole rupees.
          </p>
        </div>

        <div>
          <label
            htmlFor="fine-date"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <CalendarDays className="h-4 w-4 text-gray-400" />
            Fine Date
          </label>

          <input
            id="fine-date"
            type="date"
            value={fineDate}
            onChange={(event) => {
              setFineDate(event.target.value);
              setFormError("");
            }}
            required
            disabled={isPending}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>
      </div>

      {/* ======================================
          Reason
      ====================================== */}

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label
            htmlFor="fine-reason"
            className="flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <FileText className="h-4 w-4 text-gray-400" />
            Reason
          </label>

          <span className="text-xs text-gray-400">{reason.length}/500</span>
        </div>

        <textarea
          id="fine-reason"
          value={reason}
          onChange={(event) => {
            setReason(event.target.value);
            setFormError("");
          }}
          maxLength={500}
          rows={4}
          required
          disabled={isPending}
          placeholder="Enter the reason for this fine..."
          className="w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
        />
      </div>

      {/* ======================================
          Actions
      ====================================== */}

      <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            isPending || (!isEditing && selectedEmployee?.status === "inactive")
          }
          className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isPending
            ? "Saving..."
            : isEditing
              ? "Save Correction"
              : "Create Fine"}
        </button>
      </div>
    </form>
  );
}
