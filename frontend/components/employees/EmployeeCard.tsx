import Image from "next/image";
import Link from "next/link";

import { Phone, ShieldCheck, BadgeCheck, User, ArrowRight } from "lucide-react";

import { Employee } from "@/types/employee";

type EmployeeCardProps = {
  employee: Employee;
};

// ======================
// Format Helper
// ======================

function formatText(text?: string) {
  if (!text) return "Not Available";

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ======================
// Get Image URL (IMPORTANT for MULTER)
// ======================

function getImageUrl(path?: string) {
  if (!path) return null;

  // If already full URL
  if (path.startsWith("http")) return path;

  // Multer local server path
  return `http://localhost:5000/${path}`;
}

// ======================
// Component
// ======================

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* ================= TOP ================= */}
      <div className="relative h-28 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        {/* STATUS */}
        <div className="absolute right-4 top-4">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              employee.status?.toLowerCase() === "active"
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            <BadgeCheck className="h-3.5 w-3.5" />
            {formatText(employee.status)}
          </div>
        </div>

        {/* PROFILE IMAGE */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-slate-100 shadow-xl">
            {employee.profileImage ? (
              <Image
                src={getImageUrl(employee.profileImage)}
                alt={employee.name}
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-200">
                <User className="h-10 w-10 text-slate-500" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="px-6 pb-6 pt-16 text-center">
        {/* NAME */}
        <h2 className="line-clamp-1 text-xl font-bold tracking-tight text-slate-900">
          {formatText(employee.name)}
        </h2>

        {/* FATHER NAME */}
        <p className="mt-1 line-clamp-1 text-sm text-slate-500">
          S/O {formatText(employee.fatherName)}
        </p>

        {/* DESIGNATION */}
        <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
          <ShieldCheck className="h-4 w-4 text-slate-600" />
          {formatText(employee.designation)}
        </div>

        {/* PHONE */}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-slate-600">
          <Phone className="h-4 w-4" />
          {employee.phone1}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="mt-6 flex gap-3">
          <Link
            href={`/employees/${employee._id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href={`/employees/${employee._id}/edit`}
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
