// src/components/employees/EmployeeCard.tsx

import Image from "next/image";

import { Phone, ShieldCheck, GraduationCap, CalendarDays } from "lucide-react";

import { Employee } from "@/types/employee";

type EmployeeCardProps = {
  employee: Employee;
};

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="absolute -bottom-10 left-6">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-slate-100">
            {employee.profileImage ? (
              <Image
                src={employee.profileImage}
                alt={employee.name}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-slate-600">
                {employee.name.charAt(0)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pb-6 pt-14">
        {/* Name */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">{employee.name}</h2>

          <p className="text-sm text-slate-500">S/O {employee.fatherName}</p>
        </div>

        {/* Status */}
        <div className="mb-5 flex items-center justify-between">
          <span className="text-sm text-slate-500">Employee Status</span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              employee.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {employee.status}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <InfoItem
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Designation"
            value={employee.designation}
          />

          <InfoItem
            icon={<GraduationCap className="h-4 w-4" />}
            label="Education"
            value={employee.education}
          />

          <InfoItem
            icon={<Phone className="h-4 w-4" />}
            label="Phone"
            value={employee.phone1}
          />

          <InfoItem
            icon={<CalendarDays className="h-4 w-4" />}
            label="Entry Date"
            value={new Date(employee.entryDate).toLocaleDateString()}
          />
        </div>

        {/* Footer */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
            View
          </button>

          <button className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-500">{label}</p>

        <p className="text-sm font-semibold capitalize text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}
