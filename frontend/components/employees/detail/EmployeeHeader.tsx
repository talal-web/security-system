import Image from "next/image";

import {
  BadgeCheck,
  BriefcaseBusiness,
  Cake,
  GraduationCap,
  User,
} from "lucide-react";

import { Employee } from "@/types/employee";

import { calculateAge, formatDate, formatText } from "../EmployeeFormat";

type Props = {
  employee: Employee;
};

export default function EmployeeHeader({ employee }: Props) {
  const age = calculateAge(employee.birthDate);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-8 sm:px-10">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />
      </div>

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* PROFILE IMAGE */}
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl border-4 border-white/20 bg-white/10 shadow-2xl">
            {employee.profileImage ? (
              <Image
                src={employee.profileImage}
                alt={employee.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
            )}
          </div>

          {/* INFO */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {formatText(employee.name)}
            </h1>

            <p className="mt-2 text-sm text-slate-300">
              S/O {formatText(employee.fatherName)}
            </p>

            {/* TAGS */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Tag
                icon={<BriefcaseBusiness className="h-4 w-4" />}
                text={employee.designation}
              />

              <Tag
                icon={<GraduationCap className="h-4 w-4" />}
                text={employee.education}
              />

              <Tag icon={<Cake className="h-4 w-4" />} text={`${age} Years`} />

              <StatusBadge status={employee.status} />
            </div>
          </div>
        </div>

        {/* RIGHT STATS */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Age" value={`${age} Years`} />

          <StatCard label="Education" value={formatText(employee.education)} />

          <StatCard label="Birth Date" value={formatDate(employee.birthDate)} />

          <StatCard label="Entry Date" value={formatDate(employee.entryDate)} />
        </div>
      </div>
    </div>
  );
}

/* =========================
   UI Components
========================= */

function Tag({ icon, text }: { icon: React.ReactNode; text?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">
      {icon}
      {text || "Not Available"}
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
        status === "active"
          ? "bg-emerald-500/20 text-emerald-300"
          : "bg-red-500/20 text-red-300"
      }`}
    >
      <BadgeCheck className="h-4 w-4" />
      {formatText(status)}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
      <p className="text-xs uppercase tracking-widest text-slate-300">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
