"use client";

import { useMemo } from "react";

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

import {
  designationOptions,
  educationOptions,
} from "@/constants/employee/employeeOptions";
import { useSectors } from "@/hooks/sector/useSector";
import { shiftOptions } from "@/constants/shiftOptions";

import type { EmployeeFilters } from "@/types/employee-filters";

type Props = {
  filters: EmployeeFilters;
  onChange: (key: keyof EmployeeFilters, value: string) => void;
  onClear: () => void;
};

export default function EmployeeFilters({ filters, onChange, onClear }: Props) {
  const hasFilters = Object.values(filters).some(Boolean);

  const { data: sectorResponse, isLoading: isLoadingSectors } = useSectors({
    isActive: true,
  });

  const sectorOptions = useMemo(
    () =>
      (sectorResponse?.data ?? [])
        .filter((sector) => Boolean(sector._id))
        .map((sector) => ({
          value: sector._id,
          label: sector.name,
        })),
    [sectorResponse],
  );

  const inputClass =
    "h-9 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-2 text-[11px] text-slate-700 outline-none transition focus:border-orange-500 focus:bg-white sm:h-10 sm:rounded-xl sm:pl-10 sm:pr-4 sm:text-sm";

  const iconClass =
    "absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 sm:left-3 sm:h-4 sm:w-4";

  return (
    <div>
      {/* ================= FILTER HEADER ================= */}
      <div className="mb-2 flex items-center justify-between sm:mb-3">
        <h2 className="text-xs font-semibold text-slate-900 sm:text-base">
          Filters
        </h2>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 px-2 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50 sm:h-auto sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs"
          >
            <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* ================= FILTER GRID ================= */}
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-2 sm:gap-2.5 xl:grid-cols-3">
        {/* SEARCH */}
        <div className="relative col-span-2">
          <Search className={iconClass} />

          <input
            type="text"
            placeholder="Search employee..."
            value={filters.search ?? ""}
            onChange={(e) => onChange("search", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* STATUS */}
        <div className="relative">
          <ShieldCheck className={iconClass} />

          <select
            value={filters.status ?? ""}
            onChange={(e) => onChange("status", e.target.value)}
            className={inputClass}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* SHIFT */}
        <div className="relative">
          <Clock3 className={iconClass} />

          <select
            value={filters.defaultShift ?? ""}
            onChange={(e) => onChange("defaultShift", e.target.value)}
            className={inputClass}
          >
            <option value="">All Shifts</option>

            {shiftOptions.map((shift) => (
              <option key={shift.value} value={shift.value}>
                {shift.label}
              </option>
            ))}
          </select>
        </div>

        {/* SECTOR */}
        <div className="relative">
          <MapPin className={iconClass} />

          <select
            value={filters.sector ?? ""}
            onChange={(e) => onChange("sector", e.target.value)}
            disabled={isLoadingSectors}
            className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <option value="">
              {isLoadingSectors ? "Loading..." : "All Sectors"}
            </option>

            {sectorOptions.map((sector) => (
              <option key={sector.value} value={sector.value}>
                {sector.label}
              </option>
            ))}
          </select>
        </div>

        {/* DESIGNATION */}
        <div className="relative">
          <BriefcaseBusiness className={iconClass} />

          <select
            value={filters.designation ?? ""}
            onChange={(e) => onChange("designation", e.target.value)}
            className={inputClass}
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
          <GraduationCap className={iconClass} />

          <select
            value={filters.education ?? ""}
            onChange={(e) => onChange("education", e.target.value)}
            className={inputClass}
          >
            <option value="">All Education</option>

            {educationOptions.map((education) => (
              <option key={education.value} value={education.value}>
                {education.label}
              </option>
            ))}
          </select>
        </div>

        {/* ASSIGNMENT */}
        <div className="relative">
          <UserMinus className={iconClass} />

          <select
            value={filters.unassigned ?? ""}
            onChange={(e) => onChange("unassigned", e.target.value)}
            className={inputClass}
          >
            <option value="">All Assignments</option>

            <option value="sector">No Sector Assigned</option>

            <option value="shift">No Shift Assigned</option>

            <option value="currentLocation">
              No Current Location Assigned
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
