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
import { Button } from "@/components/ui/Button";

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
    "h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 shadow-card outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15";

  const iconClass =
    "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400";

  return (
    <div>
      {/* ================= FILTER HEADER ================= */}
      <div className="mb-3 flex min-h-8 items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Filters</h2>

        {hasFilters && (
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            <X />
            Clear
          </Button>
        )}
      </div>

      {/* ================= FILTER GRID ================= */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {/* SEARCH */}
        <div className="relative sm:col-span-2 xl:col-span-3">
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
