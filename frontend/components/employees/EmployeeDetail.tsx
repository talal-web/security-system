import { Employee } from "@/types/employee";

import {
  Phone,
  ShieldCheck,
  GraduationCap,
  CalendarDays,
  MapPin,
  BadgeCheck,
  CreditCard,
  User,
  BriefcaseBusiness,
} from "lucide-react";

type Props = {
  employee: Employee;
};

function formatText(text?: string) {
  if (!text) return "Not Available";

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function EmployeeDetail({ employee }: Props) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        {/* Top Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-8 sm:px-10">
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />
          </div>

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Left */}
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                <User className="h-10 w-10 text-white" />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {formatText(employee.name)}
                </h1>

                <p className="mt-1 text-sm text-slate-300">
                  S/O {formatText(employee.fatherName)}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">
                    <BriefcaseBusiness className="h-4 w-4" />
                    {formatText(employee.designation)}
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                      employee.status.toLowerCase() === "active"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    <BadgeCheck className="h-4 w-4" />
                    {formatText(employee.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatCard label="Age" value={employee.age} />

              <StatCard
                label="Education"
                value={formatText(employee.education)}
              />

              <StatCard
                label="Entry"
                value={new Date(employee.entryDate).toLocaleDateString()}
              />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3 sm:p-8">
          <InfoCard
            icon={<CreditCard className="h-5 w-5" />}
            label="CNIC"
            value={employee.cnic}
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
            icon={<MapPin className="h-5 w-5" />}
            label="Address"
            value={formatText(employee.address)}
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
            icon={<CalendarDays className="h-5 w-5" />}
            label="Entry Date"
            value={new Date(employee.entryDate).toLocaleDateString()}
          />
          <InfoCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="Exit Date"
            value={
              employee.exitDate
                ? new Date(employee.exitDate).toLocaleDateString()
                : "Still Working"
            }
          />
        </div>
      </div>
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
  value: any;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
        {icon}
      </div>

      <p className="text-sm font-medium text-slate-500">{label}</p>

      <p className="mt-1 break-words text-base font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
      <p className="text-xs uppercase tracking-wide text-slate-300">{label}</p>

      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
