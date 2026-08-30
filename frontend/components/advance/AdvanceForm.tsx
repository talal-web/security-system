"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  CalendarDays,
  CircleDollarSign,
  FileText,
  Loader2,
  Search,
  UserRound,
  X,
} from "lucide-react";

import { useCreateAdvance, useUpdateAdvance } from "@/hooks/advance/useAdvance";
import { lookupEmployee } from "@/services/employee.service";
import { formatText } from "@/utils/employee/employeeFormat";

import type { Advance, CreateAdvancePayload } from "@/types/advance";
import type { EmployeeLookupResult } from "@/types/employee";

interface AdvanceFormProps {
  employeeId?: string;
  advance?: Advance | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdvanceForm({
  employeeId = "",
  advance,
  onSuccess,
  onCancel,
}: AdvanceFormProps) {
  const isEditing = Boolean(advance);

  const createAdvance = useCreateAdvance();
  const updateAdvance = useUpdateAdvance(employeeId);

  const [amount, setAmount] = useState(advance?.amount?.toString() ?? "");

  const [advanceDate, setAdvanceDate] = useState(
    advance?.advanceDate
      ? advance.advanceDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );

  const [description, setDescription] = useState(advance?.description ?? "");

  const editingEmployee =
    advance && typeof advance.employee === "object"
      ? (advance.employee as EmployeeLookupResult)
      : null;

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(
    employeeId ||
      (advance
        ? typeof advance.employee === "string"
          ? advance.employee
          : advance.employee._id
        : ""),
  );

  const [searchEmpId, setSearchEmpId] = useState("");
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeLookupResult | null>(editingEmployee);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");

  const [formError, setFormError] = useState("");

  const isPending = createAdvance.isPending || updateAdvance.isPending;

  const apiError =
    createAdvance.error?.message || updateAdvance.error?.message || "";

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
          "This employee is inactive. Advances can only be created for active employees.",
        );
      }
    } catch (err) {
      setSelectedEmployee(null);
      setSelectedEmployeeId("");
      setLookupError(
        err instanceof Error ? err.message : "Employee not found.",
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

    if (!advanceDate) {
      setFormError("Please select an advance date.");
      return;
    }

    if (!isEditing && !selectedEmployeeId) {
      setFormError("Please search and select an active employee.");
      return;
    }

    if (
      !isEditing &&
      selectedEmployee &&
      selectedEmployee.status !== "active"
    ) {
      setFormError("Advance can only be created for an active employee.");
      return;
    }

    if (isEditing && advance) {
      updateAdvance.mutate(
        {
          advanceId: advance._id,
          data: {
            amount: parsedAmount,
            advanceDate,
            description: description.trim(),
          },
        },
        {
          onSuccess: () => {
            toast.success("Advance corrected successfully.");
            onSuccess();
          },
        },
      );

      return;
    }

    const payload: CreateAdvancePayload = {
      employee: selectedEmployeeId,
      amount: parsedAmount,
      advanceDate,
      description: description.trim(),
    };

    createAdvance.mutate(payload, {
      onSuccess: () => {
        toast.success("Advance created successfully.");
        onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Errors */}
      {(formError || apiError) && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{formError || apiError}</p>
        </div>
      )}

      <div className="space-y-5">
        {/* Employee Field: Edit Mode (Read-only) */}
        {isEditing && editingEmployee && (
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <UserRound className="h-4 w-4 text-gray-400" />
              Employee
            </label>

            <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {editingEmployee.name}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {editingEmployee.empId} · {editingEmployee.fatherName} ·{" "}
                    {formatText(editingEmployee.designation)}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    editingEmployee.status === "active"
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                      : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                  }`}
                >
                  {editingEmployee.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Employee Field: Creation Mode (Lookup by empId) */}
        {!isEditing && !employeeId && (
          <div>
            <label
              htmlFor="advance-empId-lookup"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <UserRound className="h-4 w-4 text-gray-400" />
              Employee
            </label>

            {selectedEmployee ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
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

                    <p className="mt-1 text-xs text-gray-500">
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
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
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
                      Advance cannot be created for an inactive employee.
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      id="advance-empId-lookup"
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
                      placeholder="Enter Employee ID (e.g. BSS-0001)"
                      className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleLookup}
                    disabled={isPending || lookupLoading || !searchEmpId.trim()}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {lookupLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Searching...</span>
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
                <p className="mt-1.5 text-xs text-gray-500">
                  Search by Employee ID to select the employee for this advance.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Amount + Date */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="advance-amount"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <CircleDollarSign className="h-4 w-4 text-gray-400" />
              Advance Amount
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                Rs.
              </span>

              <input
                id="advance-amount"
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  setFormError("");
                }}
                disabled={isPending}
                required
                inputMode="numeric"
                placeholder="5,000"
                className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-11 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
            </div>

            <p className="mt-1.5 text-xs text-gray-500">
              Enter the advance in whole rupees.
            </p>
          </div>

          <div>
            <label
              htmlFor="advance-date"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <CalendarDays className="h-4 w-4 text-gray-400" />
              Advance Date
            </label>

            <input
              id="advance-date"
              type="date"
              value={advanceDate}
              onChange={(event) => {
                setAdvanceDate(event.target.value);
                setFormError("");
              }}
              disabled={isPending}
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor="advance-description"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <FileText className="h-4 w-4 text-gray-400" />
              Description
            </label>

            <span className="text-xs text-gray-400">
              {description.length}/500
            </span>
          </div>

          <textarea
            id="advance-description"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setFormError("");
            }}
            maxLength={500}
            rows={4}
            disabled={isPending}
            placeholder="Add an optional note about this advance..."
            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-end">
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
              : "Create Advance"}
        </button>
      </div>
    </form>
  );
}
