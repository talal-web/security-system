"use client";

import { useId, type SelectHTMLAttributes, type ReactNode } from "react";

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
  useGlobalSelection?: boolean;
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
  useGlobalSelection = false,
  id,
  value,
  onChange,
  ...props
}: AreaSelectProps) {
  const { availableAreas, selectedAreaId, setSelectedAreaId, isAreaLoading } =
    useSelectedArea();

  const generatedId = useId();
  const selectId = id ?? generatedId;

  const areas = includeInactive
    ? availableAreas
    : availableAreas.filter((area) => area.isActive !== false);

  const currentValue = useGlobalSelection
    ? (selectedAreaId ?? "")
    : (value ?? "");

  const handleChange: SelectHTMLAttributes<HTMLSelectElement>["onChange"] = (
    event,
  ) => {
    if (useGlobalSelection) {
      setSelectedAreaId(event.target.value || null);
    }

    onChange?.(event);
  };

  return (
    <div className={showLabel ? "space-y-2" : undefined}>
      {showLabel && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-slate-700"
        >
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
          id={selectId}
          value={currentValue}
          onChange={handleChange}
          disabled={disabled || (useGlobalSelection && isAreaLoading)}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={`h-full w-full bg-transparent text-sm text-slate-900 outline-none disabled:cursor-not-allowed disabled:text-slate-400 ${
            className ?? ""
          }`}
        >
          <option value="">
            {isAreaLoading && useGlobalSelection
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
        <p
          id={`${selectId}-error`}
          className="mt-1 text-xs font-medium text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
}
