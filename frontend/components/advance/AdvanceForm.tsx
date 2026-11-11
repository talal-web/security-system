"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Loader2, Search, X } from "lucide-react";

import { useCreateAdvance, useUpdateAdvance } from "@/hooks/advance/useAdvance";
import { useSelectedArea } from "@/components/area/AreaContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

const fieldClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

const textareaClass =
  "w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-card transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

export default function AdvanceForm({
  employeeId = "",
  advance,
  onSuccess,
  onCancel,
}: AdvanceFormProps) {
  const { selectedAreaId } = useSelectedArea();
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

    if (!selectedAreaId) {
      setLookupError("No area is selected.");
      return;
    }

    if (!trimmed) {
      setLookupError("Please enter an Employee ID (e.g. BSS-0001).");
      return;
    }

    setLookupLoading(true);
    setLookupError("");
    setFormError("");

    try {
      const employee = await lookupEmployee(trimmed, selectedAreaId);
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
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50/70 px-3 py-2.5 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{formError || apiError}</p>
        </div>
      )}

      <div className="space-y-5">
        {/* Employee Field: Edit Mode (Read-only) */}
        {isEditing && editingEmployee && (
          <div>
            <label className={labelClass}>Employee</label>

            <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {editingEmployee.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {editingEmployee.empId} · {editingEmployee.fatherName} ·{" "}
                    {formatText(editingEmployee.designation)}
                  </p>
                </div>

                <Badge
                  tone={
                    editingEmployee.status === "active" ? "success" : "danger"
                  }
                  className="shrink-0 capitalize"
                >
                  {editingEmployee.status}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Employee Field: Creation Mode (Lookup by empId) */}
        {!isEditing && !employeeId && (
          <div>
            <label htmlFor="advance-empId-lookup" className={labelClass}>
              Employee
            </label>

            {selectedEmployee ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedEmployee.name}
                      </p>
                      <Badge
                        tone={
                          selectedEmployee.status === "active"
                            ? "success"
                            : "danger"
                        }
                        className="capitalize"
                      >
                        {selectedEmployee.status}
                      </Badge>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      ID:{" "}
                      <span className="font-medium text-slate-700">
                        {selectedEmployee.empId}
                      </span>{" "}
                      · Father:{" "}
                      <span className="font-medium text-slate-700">
                        {selectedEmployee.fatherName}
                      </span>{" "}
                      · Designation:{" "}
                      <span className="font-medium text-slate-700">
                        {formatText(selectedEmployee.designation)}
                      </span>
                    </p>
                  </div>

                  {!isPending && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleClearSelectedEmployee}
                    >
                      <X />
                      Change
                    </Button>
                  )}
                </div>

                {selectedEmployee.status !== "active" && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-red-600">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <span>
                      Advance cannot be created for an inactive employee.
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
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
                      className={fieldClass}
                    />
                  </div>

                  <Button
                    onClick={handleLookup}
                    disabled={isPending || lookupLoading || !searchEmpId.trim()}
                    className="h-10"
                  >
                    {lookupLoading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Search />
                        <span>Lookup</span>
                      </>
                    )}
                  </Button>
                </div>

                {lookupError && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {lookupError}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-slate-500">
                  Search by Employee ID to select the employee for this advance.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Amount + Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="advance-amount" className={labelClass}>
              Advance Amount
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
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
                className={`${fieldClass} pl-11 tabular-nums`}
              />
            </div>

            <p className="mt-1.5 text-xs text-slate-500">
              Enter the advance in whole rupees.
            </p>
          </div>

          <div>
            <label htmlFor="advance-date" className={labelClass}>
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
              className={fieldClass}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label
              htmlFor="advance-description"
              className="text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <span className="text-xs tabular-nums text-slate-400">
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
            className={textareaClass}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-end">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            isPending || (!isEditing && selectedEmployee?.status === "inactive")
          }
          className="w-full sm:w-auto"
        >
          {isPending
            ? "Saving..."
            : isEditing
              ? "Save Correction"
              : "Create Advance"}
        </Button>
      </div>
    </form>
  );
}
