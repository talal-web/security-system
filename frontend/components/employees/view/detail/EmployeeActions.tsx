"use client";

import Link from "next/link";
import {
  BadgeDollarSign,
  ChevronDown,
  CircleDollarSign,
  FileSpreadsheet,
  Landmark,
  Pencil,
  ReceiptText,
  WalletCards,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { useMe } from "@/hooks/auth/useMe";
import { useSelectedArea } from "@/components/area/AreaContext";

import { Button, buttonVariants } from "@/components/ui/Button";

import DeleteEmployeeButton from "./DeleteEmployeeButton";

import { exportEmployeeBioData } from "@/utils/export/employee/bioDataForm/EmployeeBioData";
import { Employee } from "@/types/employee";

interface EmployeeActionsProps {
  employee: Employee;
}

export default function EmployeeActions({ employee }: EmployeeActionsProps) {
  const { data: me } = useMe();
  const { getAreaAwareHref } = useSelectedArea();
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

  const buttonClass = buttonVariants({
    variant: "secondary",
    className: "w-full sm:w-auto",
  });

  const menuItemClass =
    "flex h-9 items-center gap-2 rounded-md px-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900";

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
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
            <CircleDollarSign />

            <span>Financial</span>

            <ChevronDown
              className={`text-slate-400 transition-transform ${
                financeOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {financeOpen && (
            <div
              id={financeMenuId}
              role="menu"
              className="absolute left-0 z-50 mt-1.5 w-full min-w-48 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-pop sm:left-auto sm:right-0 sm:w-48"
            >
              {/* Salary */}
              <Link
                href={getAreaAwareHref(`/employees/${employee._id}/salary`)}
                onClick={() => setFinanceOpen(false)}
                role="menuitem"
                className={menuItemClass}
              >
                <Landmark className="h-4 w-4 text-slate-500" />
                Salary
              </Link>

              {/* Advances */}
              <Link
                href={getAreaAwareHref(`/employees/${employee._id}/advances`)}
                onClick={() => setFinanceOpen(false)}
                role="menuitem"
                className={menuItemClass}
              >
                <WalletCards className="h-4 w-4 text-slate-500" />
                Advances
              </Link>

              {/* Bonuses */}
              <Link
                href={getAreaAwareHref(`/employees/${employee._id}/bonuses`)}
                onClick={() => setFinanceOpen(false)}
                role="menuitem"
                className={menuItemClass}
              >
                <BadgeDollarSign className="h-4 w-4 text-slate-500" />
                Bonuses
              </Link>

              {/* Deductions */}
              <Link
                href={getAreaAwareHref(`/employees/${employee._id}/deductions`)}
                onClick={() => setFinanceOpen(false)}
                role="menuitem"
                className={menuItemClass}
              >
                <ReceiptText className="h-4 w-4 text-slate-500" />
                Deductions
              </Link>

              {/* Fines */}
              <Link
                href={getAreaAwareHref(`/employees/${employee._id}/fines`)}
                onClick={() => setFinanceOpen(false)}
                role="menuitem"
                className={menuItemClass}
              >
                <CircleDollarSign className="h-4 w-4 text-slate-500" />
                Fines
              </Link>

              <Link
                href={getAreaAwareHref(`/employees/${employee._id}/payroll`)}
                onClick={() => setFinanceOpen(false)}
                role="menuitem"
                className={menuItemClass}
              >
                <ReceiptText className="h-4 w-4 text-slate-500" />
                Payroll history
              </Link>
            </div>
          )}
        </div>

        {/* Edit */}
        {canEditEmployee && (
          <Link
            href={getAreaAwareHref(`/employees/${employee._id}/edit`)}
            className={buttonClass}
          >
            <Pencil />
            <span>Edit</span>
          </Link>
        )}

        {/* Export */}
        <Button
          variant="secondary"
          onClick={() =>
            exportEmployeeBioData({
              employee,
              title: `${employee.empId} - Bio Data`,
            })
          }
          className="w-full sm:w-auto"
        >
          <FileSpreadsheet className="text-emerald-600" />
          <span>Export</span>
        </Button>

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
