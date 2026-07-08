import Image from "next/image";
import Link from "next/link";
import DeleteEmployeeButton from "./DeleteEmployeeButton";
import { Printer } from "lucide-react";

import {
  BadgeCheck,
  BriefcaseBusiness,
  Cake,
  CalendarDays,
  Clock3,
  CreditCard,
  GraduationCap,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  Banknote,
  User,
} from "lucide-react";

import { Employee } from "@/types/employee";

import {
  calculateAge,
  formatDate,
  formatText,
} from "@/utils/employee/employeeFormat";

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

        <div className="relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-800">
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
                      icon={<User className="h-4 w-4" />}
                      text={employee.empId}
                    />
                    <Tag
                      icon={<Banknote className="h-4 w-4" />}
                      text={`Rs. ${employee.basicSalary?.toLocaleString()}`}
                    />

                    <Tag
                      icon={<MapPin className="h-4 w-4" />}
                      text={
                        typeof employee.currentLocation === "string"
                          ? employee.currentLocation
                          : employee.currentLocation?.name
                      }
                    />

                    <Tag
                      icon={<BriefcaseBusiness className="h-4 w-4" />}
                      text={formatText(employee.designation)}
                    />

                    <Tag
                      icon={<GraduationCap className="h-4 w-4" />}
                      text={formatText(employee.education ?? undefined)}
                    />

                    <Tag
                      icon={<Cake className="h-4 w-4" />}
                      text={`${age} Years`}
                    />

                    <StatusBadge status={employee.status} />
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-5 sm:flex-row sm:justify-end sm:gap-3">
              <Link
                href={`/employees/${employee._id}/edit`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:h-12 sm:px-5 sm:text-sm"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>

              <Link
                href={`/employees/${employee._id}/print`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-700 sm:h-12 sm:px-5 sm:text-sm"
              >
                <Printer className="h-4 w-4" />
                Print
              </Link>

              <div className="sm:flex">
                <DeleteEmployeeButton employeeId={employee._id} />
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            DETAILS
        ========================= */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-8">
            {/* ================= PERSONAL INFO ================= */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-1 rounded-full bg-orange-500" />

                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <InfoCard
                  icon={<CreditCard className="h-5 w-5" />}
                  label="CNIC Number"
                  value={employee.cnic}
                />

                <InfoCard
                  icon={<Cake className="h-5 w-5" />}
                  label="Birth Date"
                  value={formatDate(employee.birthDate)}
                />

                <InfoCard
                  icon={<User className="h-5 w-5" />}
                  label="Reference"
                  value={formatText(employee.reference)}
                />
              </div>
            </section>

            {/* ================= CONTACT INFO ================= */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-1 rounded-full bg-blue-500" />

                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {/* ADDRESS FULL WIDTH */}
                <div className="md:col-span-2 xl:col-span-3">
                  <InfoCard
                    icon={<MapPin className="h-5 w-5" />}
                    label="Residential Address"
                    value={formatText(employee.address)}
                    large
                  />
                </div>

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
              </div>
            </section>

            {/* ================= EMPLOYMENT INFO ================= */}
            <section>
              <SectionTitle
                title="Employment Information"
                color="bg-emerald-500"
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoCard
                  icon={<BriefcaseBusiness className="h-5 w-5" />}
                  label="Designation"
                  value={formatText(employee.designation)}
                />

                <InfoCard
                  icon={<MapPin className="h-5 w-5" />}
                  label="Current Location"
                  value={
                    typeof employee.currentLocation === "string"
                      ? employee.currentLocation
                      : employee.currentLocation?.name
                  }
                />

                <InfoCard
                  icon={<ShieldCheck className="h-5 w-5" />}
                  label="Sector"
                  value={formatText(employee.sector)}
                />

                <InfoCard
                  icon={<Banknote className="h-5 w-5" />}
                  label="Basic Salary"
                  value={`Rs. ${employee.basicSalary?.toLocaleString()}`}
                />

                <InfoCard
                  icon={<BadgeCheck className="h-5 w-5" />}
                  label="Status"
                  value={formatText(employee.status)}
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
              </div>
            </section>

            {/* ================= NOTES ================= */}
            {employee.notes && (
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-8 w-1 rounded-full bg-slate-900" />

                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    Additional Notes
                  </h2>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-700 sm:text-[15px]">
                    {employee.notes}
                  </p>
                </div>
              </section>
            )}
          </div>
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

function SectionTitle({ title, color }: { title: string; color: string }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className={`h-8 w-1 rounded-full ${color}`} />
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{title}</h2>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  large = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  large?: boolean;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-5">
      {/* ICON */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
        {icon}
      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">
        {/* LABEL */}
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>

        {/* VALUE */}
        <div
          className={`mt-1 text-sm font-semibold text-slate-900 ${
            large ? "wrap-break-word leading-7" : "truncate"
          }`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
