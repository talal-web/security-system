"use client";

import { X } from "lucide-react";

import { EmployeeFilters } from "@/types/employee-filters";

type Props = {
  filters: EmployeeFilters;

  removeFilter: (key: keyof EmployeeFilters) => void;
};

export default function ActiveFilters({ filters, removeFilter }: Props) {
  const hasFilters = Object.entries(filters).some(
    ([key, value]) => key !== "search" && Boolean(value),
  );

  if (!hasFilters) return null;

  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {Object.entries(filters).map(
        ([key, value]) =>
          key !== "search" &&
          value && (
            <div
              key={key}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
            >
              <span>
                {key}: {value}
              </span>

              <button
                type="button"
                onClick={() => removeFilter(key as keyof EmployeeFilters)}
                className="transition hover:text-red-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ),
      )}
    </div>
  );
}
