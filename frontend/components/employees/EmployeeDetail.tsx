import Image from "next/image";
import Link from "next/link";
import DeleteEmployeeButton from "./DeleteEmployeeButton";
import { Printer } from "lucide-react";

import {
  BadgeCheck,
  BriefcaseBusiness,
  Cake,
  CalendarClock,
  CalendarDays,
  Clock3,
  CreditCard,
  GraduationCap,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";

import { Employee } from "@/types/employee";

import { calculateAge, formatDate, formatText } from "@/lib/employeeFormat";

type Props = {
  employee: Employee;
};

export default function EmployeeDetail({ employee }: Props) {
  const age = calculateAge(employee.birthDate);

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)]">
        {/* =========================
            HEADER
        ========================= */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
          {/* Glow Effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white blur-3xl" />

            <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-slate-400 blur-3xl" />
          </div>

          <div className="relative px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-10">
            {/* TOP SECTION */}
            <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
              {/* PROFILE SECTION */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                {/* IMAGE */}
                <div className="mx-auto sm:mx-0">
                  <div className="relative h-28 w-28 overflow-hidden rounded-[30px] border-4 border-white/15 bg-white/10 shadow-2xl sm:h-32 sm:w-32">
                    {employee.profileImage ? (
                      <Image
                        src={employee.profileImage}
                        alt={employee.name}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-12 w-12 text-white sm:h-14 sm:w-14" />
                      </div>
                    )}
                  </div>
                </div>

                {/* INFO */}
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                    {formatText(employee.name)}
                  </h1>

                  <p className="mt-2 text-sm text-slate-300 sm:text-base">
                    S/O {formatText(employee.fatherName)}
                  </p>

                  {/* TAGS */}
                  <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                    <Tag
                      icon={<BriefcaseBusiness className="h-4 w-4" />}
                      text={formatText(employee.designation)}
                    />

                    <Tag
                      icon={<GraduationCap className="h-4 w-4" />}
                      text={formatText(employee.education)}
                    />

                    <Tag
                      icon={<Cake className="h-4 w-4" />}
                      text={`${age} Years`}
                    />

                    <StatusBadge status={employee.status} />
                  </div>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:w-[500px]">
                <StatCard label="Age" value={`${age} Years`} />

                <StatCard
                  label="Education"
                  value={formatText(employee.education)}
                />

                <StatCard
                  label="Birth Date"
                  value={formatDate(employee.birthDate)}
                />

                <StatCard
                  label="Entry Date"
                  value={formatDate(employee.entryDate)}
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
              <Link
                href={`/employees/${employee._id}/edit`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:bg-white/20"
              >
                <Pencil className="h-4 w-4" />
                Edit Employee
              </Link>
              <Link
                href={`/employees/${employee._id}/print`}
                className="inline-flex items-center gap-2 h-12 px-5 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                <Printer className="h-4 w-4" />
                Print
              </Link>

              <DeleteEmployeeButton employeeId={employee._id} />
            </div>
          </div>
        </div>

        {/* =========================
            DETAILS
        ========================= */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
            <InfoCard
              icon={<CreditCard className="h-5 w-5" />}
              label="CNIC Number"
              value={employee.cnic}
            />
            <InfoCard
              icon={<MapPin className="h-5 w-5" />}
              label="Residential Address"
              value={formatText(employee.address)}
            />

            <InfoCard
              icon={<Phone className="h-5 w-5" />}
              label="Primary Phone"
              value={employee.phone1}
            />

            <InfoCard
              icon={<Phone className="h-5 w-5" />}
              label="Secondary Phone"
              value={employee.phone2 || "Not Available"}
            />

            <InfoCard
              icon={<ShieldCheck className="h-5 w-5" />}
              label="Designation"
              value={formatText(employee.designation)}
            />

            <InfoCard
              icon={<GraduationCap className="h-5 w-5" />}
              label="Education"
              value={formatText(employee.education)}
            />

            <InfoCard
              icon={<Cake className="h-5 w-5" />}
              label="Birth Date"
              value={formatDate(employee.birthDate)}
            />

            <InfoCard
              icon={<CalendarDays className="h-5 w-5" />}
              label="Entry Date"
              value={formatDate(employee.entryDate)}
            />

            <InfoCard
              icon={<Clock3 className="h-5 w-5" />}
              label="Exit Date"
              value={
                employee.exitDate
                  ? formatDate(employee.exitDate)
                  : "Currently Working"
              }
            />

            <InfoCard
              icon={<CalendarClock className="h-5 w-5" />}
              label="Created At"
              value={formatDate(employee.createdAt)}
            />

            <InfoCard
              icon={<User className="h-5 w-5" />}
              label="Reference"
              value={formatText(employee.reference)}
            />
          </div>

          {/* NOTES */}
          {employee.notes && (
            <div className="mt-6 border-t border-slate-200 pt-6">
              <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Additional Notes
                </h2>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-7 text-slate-700 sm:p-5 sm:text-[15px]">
                  {employee.notes}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================
   SMALL UI COMPONENTS
========================= */

function Tag({ icon, text }: { icon: React.ReactNode; text?: string }) {
  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-slate-200 backdrop-blur sm:px-4 sm:text-sm">
      <span className="shrink-0">{icon}</span>

      <span className="truncate">{text || "Not Available"}</span>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const isActive = status === "active";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold backdrop-blur sm:px-4 sm:text-sm ${
        isActive
          ? "border border-emerald-400/20 bg-emerald-500/15 text-emerald-300"
          : "border border-red-400/20 bg-red-500/15 text-red-300"
      }`}
    >
      <BadgeCheck className="h-4 w-4" />

      {formatText(status)}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.14]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-300 sm:text-xs">
        {label}
      </p>

      <p className="mt-2 line-clamp-2 text-sm font-bold text-white sm:text-[15px]">
        {value}
      </p>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="group rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      {/* ICON */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      {/* LABEL */}
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 sm:text-sm">
        {label}
      </p>

      {/* VALUE */}
      <div className="mt-3 break-words text-sm font-bold leading-6 text-slate-900 sm:text-[15px]">
        {value}
      </div>
    </div>
  );
}
