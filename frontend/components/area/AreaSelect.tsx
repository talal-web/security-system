"use client";

import type { SelectHTMLAttributes, ReactNode } from "react";

import { useSelectedArea } from "@/components/area/AreaContext";

type AreaSelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  label?: string;
  showLabel?: boolean;
  icon?: ReactNode;
  error?: string;
  placeholder?: string;
  includeInactive?: boolean;
  wrapperClassName?: string;
};

export default function AreaSelect({
  label = "Area",
  showLabel = true,
  icon,
  error,
  placeholder = "Select Area",
  includeInactive = false,
  wrapperClassName,
  className,
  disabled,
  ...props
}: AreaSelectProps) {
  const { availableAreas, selectedAreaId } = useSelectedArea();

  const areas = (
    includeInactive
      ? availableAreas
      : availableAreas.filter((area) => area.isActive !== false)
  ).filter(Boolean);

  const isLoading = false;
  const currentValue = props.value ?? selectedAreaId ?? "";

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
          value={currentValue}
          disabled={disabled || isLoading}
          className={`h-full w-full bg-transparent text-sm text-slate-900 outline-none disabled:cursor-not-allowed disabled:text-slate-400 ${
            className ?? ""
          }`}
        >
          <option value="">
            {isLoading
              ? "Loading areas..."
              : areas.length === 0
                ? "No areas available"
                : placeholder}
          </option>

          {areas.map((area) => (
            <option key={area._id} value={area._id}>
              {area.name}
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
