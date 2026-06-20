"use client";

import Image from "next/image";
import Link from "next/link";

import { Phone, ShieldCheck, BadgeCheck, User, ArrowRight } from "lucide-react";

import { Employee } from "@/types/employee";
import { formatText } from "@/lib/employeeFormat";

type EmployeeCardProps = {
  employee: Employee;
};

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
      {/* ================= DESKTOP CARD ================= */}
      <div className="hidden sm:block">
        {/* TOP */}
        <div className="relative h-28 bg-gradient-to-r from-slate-900 to-slate-800">
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

      {/* ================= MOBILE CARD (TIKTOK STYLE) ================= */}
      <div className="flex items-center gap-3 p-3 sm:hidden">
        {/* AVATAR */}
        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border bg-slate-100">
          {employee.profileImage ? (
            <Image
              src={employee.profileImage}
              alt={employee.name}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-6 w-6 text-slate-400" />
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="truncate text-sm font-semibold text-slate-900">
              {formatText(employee.name)}
            </h2>

            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                employee.status === "active"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {employee.status}
            </span>
          </div>

          <p className="truncate text-xs text-slate-500">
            {formatText(employee.designation)}
          </p>
        </div>

        {/* ACTION */}
        <Link href={`/employees/${employee._id}`} className="text-slate-500">
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
