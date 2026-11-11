"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Loader2, Search, X } from "lucide-react";

import { useCreateBonus, useUpdateBonus } from "@/hooks/bonus/useBonus";

import { useSelectedArea } from "@/components/area/AreaContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { lookupEmployee } from "@/services/employee.service";
import { formatText } from "@/utils/employee/employeeFormat";

import type { Bonus, CreateBonusPayload } from "@/types/bonus";

import type { EmployeeLookupResult } from "@/types/employee";

interface BonusFormProps {
  employeeId?: string;
  bonus?: Bonus | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

const fieldClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

const textareaClass =
  "w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-card transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

export default function BonusForm({
  employeeId = "",
  bonus = null,
  onSuccess,
  onCancel,
}: BonusFormProps) {
  const { selectedAreaId } = useSelectedArea();
  const isEditing = Boolean(bonus);

  const createBonusMutation = useCreateBonus();
  const updateBonusMutation = useUpdateBonus(employeeId);

  const editingEmployee =
    bonus && typeof bonus.employee === "object"
      ? (bonus.employee as EmployeeLookupResult)
      : null;

  const initialEmployeeId =
    employeeId ||
    (bonus
      ? typeof bonus.employee === "string"
        ? bonus.employee
        : bonus.employee._id
      : "");

  // ======================================
  // Form State
  // ======================================

  const [amount, setAmount] = useState(bonus?.amount?.toString() ?? "");

  const [bonusDate, setBonusDate] = useState(
    bonus?.bonusDate
      ? bonus.bonusDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );

  const [reason, setReason] = useState(bonus?.reason ?? "");

  const [selectedEmployeeId, setSelectedEmployeeId] =
    useState(initialEmployeeId);

  const [searchEmpId, setSearchEmpId] = useState("");

  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeLookupResult | null>(editingEmployee);

  const [lookupLoading, setLookupLoading] = useState(false);

  const [lookupError, setLookupError] = useState("");
  const [formError, setFormError] = useState("");

  const isPending =
    createBonusMutation.isPending || updateBonusMutation.isPending;

  const apiError =
    createBonusMutation.error?.message ||
    updateBonusMutation.error?.message ||
    "";

  // ======================================
  // Employee Lookup
  // ======================================

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
          "This employee is inactive. Bonuses can only be created for active employees.",
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

    if (!bonusDate) {
      setFormError("Please select a bonus date.");
      return;
    }

    if (!reason.trim()) {
      setFormError("Bonus reason is required.");
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
      setFormError("Bonus can only be created for an active employee.");
      return;
    }

    // ======================================
    // Correct Existing Bonus
    // ======================================

    if (isEditing && bonus) {
      updateBonusMutation.mutate(
        {
          bonusId: bonus._id,
          data: {
            amount: parsedAmount,
            bonusDate,
            reason: reason.trim(),
          },
        },
        {
          onSuccess: () => {
            toast.success("Bonus corrected successfully.");
            onSuccess();
          },
        },
      );

      return;
    }

    // ======================================
    // Create New Bonus
    // ======================================

    const payload: CreateBonusPayload = {
      employeeId: selectedEmployeeId,
      amount: parsedAmount,
      bonusDate,
      reason: reason.trim(),
    };

    createBonusMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Bonus created successfully.");
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

      {/* Employee */}
      <div>
        {/* Edit mode */}
        {isEditing && editingEmployee && (
          <>
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
          </>
        )}

        {/* Global create mode */}
        {!isEditing && !employeeId && (
          <>
            <label htmlFor="bonus-empId-lookup" className={labelClass}>
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
                      Bonus cannot be created for an inactive employee.
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="bonus-empId-lookup"
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
                      className={`${fieldClass} pl-9`}
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
                        <span className="hidden sm:inline">Searching...</span>
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

                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  Search by Employee ID to select the employee.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Amount + Date */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bonus-amount" className={labelClass}>
            Bonus Amount
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              Rs.
            </span>

            <input
              id="bonus-amount"
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
              placeholder="10,000"
              className={`${fieldClass} pl-11 tabular-nums`}
            />
          </div>

          <p className="mt-1.5 text-xs text-slate-500">
            Enter the bonus in whole rupees.
          </p>
        </div>

        <div>
          <label htmlFor="bonus-date" className={labelClass}>
            Bonus Date
          </label>

          <input
            id="bonus-date"
            type="date"
            value={bonusDate}
            onChange={(event) => {
              setBonusDate(event.target.value);
              setFormError("");
            }}
            required
            disabled={isPending}
            className={fieldClass}
          />
        </div>
      </div>

      {/* Reason */}
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <label
            htmlFor="bonus-reason"
            className="text-sm font-medium text-slate-700"
          >
            Reason
          </label>

          <span className="text-xs tabular-nums text-slate-400">
            {reason.length}/500
          </span>
        </div>

        <textarea
          id="bonus-reason"
          value={reason}
          onChange={(event) => {
            setReason(event.target.value);
            setFormError("");
          }}
          maxLength={500}
          rows={4}
          required
          disabled={isPending}
          placeholder="Enter the reason for this bonus..."
          className={textareaClass}
        />
      </div>

      {/* Actions */}
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
              : "Create Bonus"}
        </Button>
      </div>
    </form>
  );
}
