"use client";

import Image from "next/image";

import { Phone, ShieldCheck, User, Eye, Pencil } from "lucide-react";

import { useSelectedArea } from "@/components/area/AreaContext";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Employee } from "@/types/employee";
import { formatText } from "@/utils/employee/employeeFormat";

type EmployeeCardProps = {
  employee: Employee;
};

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  const { getAreaAwareHref } = useSelectedArea();

  const statusTone = employee.status === "active" ? "success" : "danger";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-card transition-colors hover:border-slate-300">
      {/* ================= DESKTOP CARD ================= */}
      <div className="hidden h-full flex-col p-5 sm:flex">
        {/* TOP */}
        <div className="flex items-start justify-between gap-3">
          {/* IMAGE */}
          <div className="size-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
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
                <User className="size-6 text-slate-400" />
              </div>
            )}
          </div>

          {/* STATUS */}
          <Badge tone={statusTone} dot>
            {formatText(employee.status)}
          </Badge>
        </div>

        {/* BODY */}
        <div className="mt-4 min-w-0">
          <h2 className="truncate text-sm font-semibold text-slate-900">
            {formatText(employee.name)}
          </h2>

          <p className="mt-0.5 truncate text-xs text-slate-500">
            S/O {formatText(employee.fatherName)}
          </p>
        </div>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex min-w-0 items-center gap-2">
            <ShieldCheck className="size-4 shrink-0 text-slate-400" />
            <span className="truncate">{formatText(employee.designation)}</span>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <Phone className="size-4 shrink-0 text-slate-400" />
            <span className="truncate tabular-nums">{employee.phone1}</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
          <ButtonLink
            href={getAreaAwareHref(`/employees/${employee._id}`)}
            variant="secondary"
            size="sm"
            className="flex-1"
          >
            View
          </ButtonLink>

          <ButtonLink
            href={getAreaAwareHref(`/employees/${employee._id}/edit`)}
            variant="secondary"
            size="sm"
            className="flex-1"
          >
            Edit
          </ButtonLink>
        </div>
      </div>

      {/* ================= MOBILE CARD ================= */}
      <div className="flex items-center gap-3 p-3 sm:hidden">
        {/* AVATAR */}
        <div className="size-10 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
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
              <User className="size-5 text-slate-400" />
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="min-w-0 flex-1">
          {/* NAME + STATUS */}
          <div className="flex min-w-0 items-center gap-1.5">
            <h2 className="min-w-0 truncate text-sm font-medium text-slate-900">
              {formatText(employee.name)}
            </h2>
          </div>

          {/* DESIGNATION + PHONE */}
          <div className="mt-0.5 flex min-w-0 items-center gap-2 text-xs text-slate-500">
            <span className="truncate">{formatText(employee.designation)}</span>
          </div>
        </div>

        {/* ACTION ICONS */}
        <div className="flex shrink-0 items-center gap-1">
          {/* VIEW */}
          <ButtonLink
            href={getAreaAwareHref(`/employees/${employee._id}`)}
            title="View Employee"
            aria-label="View Employee"
            variant="secondary"
            size="icon-sm"
          >
            <Eye />
          </ButtonLink>

          {/* EDIT */}
          <ButtonLink
            href={getAreaAwareHref(`/employees/${employee._id}/edit`)}
            title="Edit Employee"
            aria-label="Edit Employee"
            variant="ghost"
            size="icon-sm"
          >
            <Pencil />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
