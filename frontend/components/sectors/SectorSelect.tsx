"use client";

import React from "react";
import { useSectors } from "@/hooks/sector/useSector";

type SectorSelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  label?: string;
  showLabel?: boolean;
  icon?: React.ReactNode;
  error?: string;
  placeholder?: string;
  includeInactive?: boolean;
  wrapperClassName?: string;
};

export default function SectorSelect({
  label = "Sector",
  showLabel = true,
  icon,
  error,
  placeholder = "Select Sector",
  includeInactive = false,
  wrapperClassName,
  className,
  disabled,
  ...props
}: SectorSelectProps) {
  const { data, isLoading } = useSectors({
    isActive: includeInactive ? undefined : true,
  });

  const sectors = data?.data ?? [];

  return (
    <div className={showLabel ? "space-y-2" : undefined}>
      {showLabel && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div
        className={
          wrapperClassName ??
          "flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3"
        }
      >
        {icon && (
          <span className="shrink-0 text-slate-400 [&_svg]:h-4 [&_svg]:w-4">
            {icon}
          </span>
        )}

        <select
          {...props}
          disabled={disabled || isLoading}
          className={`h-full w-full bg-transparent text-sm text-slate-900 outline-none disabled:cursor-not-allowed disabled:text-slate-400 ${
            className ?? ""
          }`}
        >
          <option value="">
            {isLoading ? "Loading sectors..." : placeholder}
          </option>

          {sectors.map((sector) => (
            <option key={sector._id} value={sector._id}>
              {sector.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}
