"use client";

import Link from "next/link";
import {
  ChevronDown,
  CircleDollarSign,
  FileSpreadsheet,
  Landmark,
  Pencil,
  WalletCards,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { useMe } from "@/hooks/auth/useMe";

import DeleteEmployeeButton from "./DeleteEmployeeButton";

import { exportEmployeeBioData } from "@/utils/export/employee/bioDataForm/EmployeeBioData";
import { Employee } from "@/types/employee";

interface EmployeeActionsProps {
  employee: Employee;
}

export default function EmployeeActions({ employee }: EmployeeActionsProps) {
  const { data: me } = useMe();
  const role = me?.user?.role;

  const canEditEmployee = ["developer", "admin", "clerk"].includes(role ?? "");

  const [financeOpen, setFinanceOpen] = useState(false);
  const financeMenuId = useId();
  const financeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!financeRef.current?.contains(event.target as Node)) {
        setFinanceOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFinanceOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const buttonClass =
    "inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 sm:w-auto";

  return (
    <div className="mt-4 border-t border-slate-200 pt-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
        {/* Financial */}
        <div ref={financeRef} className="relative w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFinanceOpen((open) => !open)}
            className={buttonClass}
            aria-expanded={financeOpen}
            aria-controls={financeMenuId}
          >
            <CircleDollarSign className="h-4 w-4 shrink-0" />

            <span>Financial</span>

            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                financeOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {financeOpen && (
            <div
              id={financeMenuId}
              role="menu"
              className="absolute right-0 z-50 mt-1.5 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
            >
              <Link
                href={`/employees/${employee._id}/salary`}
                onClick={() => setFinanceOpen(false)}
                role="menuitem"
                className="flex h-9 items-center gap-2 rounded-md px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <Landmark className="h-4 w-4 text-slate-500" />
                Salary
              </Link>

              <Link
                href={`/employees/${employee._id}/advances`}
                onClick={() => setFinanceOpen(false)}
                role="menuitem"
                className="flex h-9 items-center gap-2 rounded-md px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <WalletCards className="h-4 w-4 text-slate-500" />
                Advances
              </Link>

              <Link
                href={`/employees/${employee._id}/fines`}
                onClick={() => setFinanceOpen(false)}
                role="menuitem"
                className="flex h-9 items-center gap-2 rounded-md px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <CircleDollarSign className="h-4 w-4 text-slate-500" />
                Fines
              </Link>
            </div>
          )}
        </div>

        {/* Edit */}
        {canEditEmployee && (
          <Link
            href={`/employees/${employee._id}/edit`}
            className={buttonClass}
          >
            <Pencil className="h-4 w-4 shrink-0" />
            <span>Edit</span>
          </Link>
        )}

        {/* Export */}
        <button
          type="button"
          onClick={() =>
            exportEmployeeBioData({
              employee,
              title: `${employee.empId} - Bio Data`,
            })
          }
          className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:border-emerald-700 hover:bg-emerald-700 sm:w-auto"
        >
          <FileSpreadsheet className="h-4 w-4 shrink-0" />
          <span>Export</span>
        </button>

        {/* Delete */}
        {canEditEmployee && (
          <div className="w-full sm:w-auto">
            <DeleteEmployeeButton employeeId={employee._id} />
          </div>
        )}
      </div>
    </div>
  );
}
