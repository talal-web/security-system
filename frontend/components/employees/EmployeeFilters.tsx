"use client";

import {
  Search,
  ShieldCheck,
  BriefcaseBusiness,
  MapPin,
  Clock3,
  GraduationCap,
  UserMinus,
  X,
} from "lucide-react";

import { designationOptions, educationOptions } from "@/constants/employee";
import { sectorOptions } from "@/constants/location";
import { shiftOptions } from "@/constants/shiftOptions";

import { EmployeeFilters } from "@/types/employee-filters";

type Props = {
  filters: EmployeeFilters;
  onChange: (key: keyof EmployeeFilters, value: string) => void;
  onClear: () => void;
};

export default function EmployeeFilters({ filters, onChange, onClear }: Props) {
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search employee..."
            value={filters.search ?? ""}
            onChange={(e) => onChange("search", e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
          />
        </div>

        {/* STATUS */}
        <div className="relative">
          <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={filters.status ?? ""}
            onChange={(e) => onChange("status", e.target.value)}
            className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* DESIGNATION */}
        <div className="relative">
          <BriefcaseBusiness className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={filters.designation ?? ""}
            onChange={(e) => onChange("designation", e.target.value)}
            className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
          >
            <option value="">All Designations</option>

            {designationOptions.map((designation) => (
              <option key={designation.value} value={designation.value}>
                {designation.label}
              </option>
            ))}
          </select>
        </div>

        {/* EDUCATION */}
        <div className="relative">
          <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={filters.education ?? ""}
            onChange={(e) => onChange("education", e.target.value)}
            className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
          >
            <option value="">All Education</option>

            {educationOptions.map((education) => (
              <option key={education.value} value={education.value}>
                {education.label}
              </option>
            ))}
          </select>
        </div>

        {/* SECTOR */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={filters.sector ?? ""}
            onChange={(e) => onChange("sector", e.target.value)}
            className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
          >
            <option value="">All Sectors</option>

            <option value="unassigned">No Sector Assigned</option>

            {sectorOptions.map((sector) => (
              <option key={sector.value} value={sector.value}>
                {sector.label}
              </option>
            ))}
          </select>
        </div>

        {/* SHIFT */}
        <div className="relative">
          <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={filters.defaultShift ?? ""}
            onChange={(e) => onChange("defaultShift", e.target.value)}
            className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
          >
            <option value="">All Shifts</option>

            <option value="unassigned">No Shift Assigned</option>

            {shiftOptions.map((shift) => (
              <option key={shift.value} value={shift.value}>
                {shift.label}
              </option>
            ))}
          </select>
        </div>

        {/* EXITED */}
        <div className="relative">
          <UserMinus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={
              filters.hasExited === undefined ? "" : String(filters.hasExited)
            }
            onChange={(e) => onChange("hasExited", e.target.value)}
            className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
          >
            <option value="">All Employees</option>
            <option value="true">Exited Employees</option>
            <option value="false">Active Employees</option>
          </select>
        </div>
      </div>

      {hasFilters && (
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
          >
            <X className="h-3.5 w-3.5" />
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
