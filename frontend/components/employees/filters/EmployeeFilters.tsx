"use client";

import { EmployeeFilters as EmployeeFiltersType } from "@/types/employee-filters";

import { BriefcaseBusiness, Clock3, MapPin, ShieldCheck } from "lucide-react";

import { designationOptions } from "@/constants/employee";
import { shiftOptions } from "@/constants/shiftOptions";
import { sectorOptions } from "@/constants/location";

type Props = {
  tempFilters: EmployeeFiltersType;

  setTempFilters: React.Dispatch<React.SetStateAction<EmployeeFiltersType>>;

  applyFilters: () => void;

  clearFilters: () => void;
};

export default function EmployeeFilters({
  tempFilters,
  setTempFilters,
  applyFilters,
  clearFilters,
}: Props) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="relative">
          <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={tempFilters.status}
            onChange={(e) =>
              setTempFilters((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
            className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-orange-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="relative">
          <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={tempFilters.defaultShift}
            onChange={(e) =>
              setTempFilters((prev) => ({
                ...prev,
                defaultShift: e.target.value,
              }))
            }
            className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-orange-500"
          >
            <option value="">All Shifts</option>

            {shiftOptions.map((shift) => (
              <option key={shift.value} value={shift.value}>
                {shift.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <BriefcaseBusiness className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={tempFilters.designation}
            onChange={(e) =>
              setTempFilters((prev) => ({
                ...prev,
                designation: e.target.value,
              }))
            }
            className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-orange-500"
          >
            <option value="">All Designations</option>

            {designationOptions.map((designation) => (
              <option key={designation.value} value={designation.value}>
                {designation.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={tempFilters.sector}
            onChange={(e) =>
              setTempFilters((prev) => ({
                ...prev,
                sector: e.target.value,
              }))
            }
            className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-orange-500"
          >
            <option value="">All Sectors</option>

            {sectorOptions.map((sector) => (
              <option key={sector.value} value={sector.value}>
                {sector.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={clearFilters}
          className="h-11 rounded-2xl border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-600 hover:bg-red-100"
        >
          Clear Filters
        </button>

        <button
          type="button"
          onClick={applyFilters}
          className="h-11 rounded-2xl bg-orange-600 px-5 text-sm font-semibold text-white hover:bg-orange-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
