"use client";

import Image from "next/image";
import Link from "next/link";

import { Phone, ShieldCheck, BadgeCheck, User } from "lucide-react";

import { Employee } from "@/types/employee";
import { formatText } from "@/utils/employee/employeeFormat";

type EmployeeCardProps = {
  employee: Employee;
};

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
      {/* ================= DESKTOP CARD ================= */}
      <div className="hidden sm:block">
        {/* TOP */}
        <div className="relative h-28 bg-linear-to-r from-slate-900 to-slate-800">
          {/* STATUS */}
          <div className="absolute right-3 top-3">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                employee.status === "active"
                  ? "bg-green-500/20 text-green-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              <BadgeCheck className="h-3 w-3" />
              {formatText(employee.status)}
            </span>
          </div>

          {/* IMAGE */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="h-20 w-20 overflow-hidden rounded-2xl border-4 border-white bg-slate-100">
              {employee.profileImage ? (
                <Image
                  src={employee.profileImage}
                  alt={employee.name}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-8 w-8 text-slate-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="px-5 pb-5 pt-12 text-center">
          <h2 className="text-lg font-bold text-slate-900">
            {formatText(employee.name)}
          </h2>

          <p className="text-sm text-slate-500">
            S/O {formatText(employee.fatherName)}
          </p>

          <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-sm font-medium">
            <ShieldCheck className="h-4 w-4" />
            {formatText(employee.designation)}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600">
            <Phone className="h-4 w-4" />
            {employee.phone1}
          </div>

          {/* ACTIONS */}
          <div className="mt-5 flex gap-2">
            <Link
              href={`/employees/${employee._id}`}
              className="flex-1 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
            >
              View
            </Link>

            <Link
              href={`/employees/${employee._id}/edit`}
              className="flex-1 rounded-xl border px-3 py-2 text-sm font-semibold"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* ================= MOBILE CARD ================= */}
      <div className="flex items-center gap-2.5 p-2.5 sm:hidden">
        {/* AVATAR */}
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
          {employee.profileImage ? (
            <Image
              src={employee.profileImage}
              alt={employee.name}
              width={44}
              height={44}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-5 w-5 text-slate-400" />
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="min-w-0 flex-1">
          {/* NAME + STATUS */}
          <div className="flex min-w-0 items-center gap-1.5">
            <h2 className="min-w-0 truncate text-xs font-semibold text-slate-900">
              {formatText(employee.name)}
            </h2>
          </div>

          {/* DESIGNATION + PHONE */}
          <div className="mt-0.5 flex min-w-0 items-center gap-2 text-[9px] text-slate-500">
            <span className="truncate">{formatText(employee.designation)}</span>
          </div>
        </div>

        {/* ACTION ICONS */}
        <div className="flex shrink-0 items-center gap-1">
          {/* VIEW */}
          <Link
            href={`/employees/${employee._id}`}
            title="View Employee"
            aria-label="View Employee"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-3.5 w-3.5"
            >
              <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          </Link>

          {/* EDIT */}
          <Link
            href={`/employees/${employee._id}/edit`}
            title="Edit Employee"
            aria-label="Edit Employee"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white transition hover:bg-slate-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-3.5 w-3.5"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
