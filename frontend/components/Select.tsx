import React from "react";

type SelectOption = string | { label: string; value: string };

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  icon?: React.ReactNode;
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
};

function formatText(text: string) {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getOptionLabel(option: SelectOption) {
  return typeof option === "string" ? formatText(option) : option.label;
}

function getOptionValue(option: SelectOption) {
  return typeof option === "string" ? option : option.value;
}

export default function Select({
  icon,
  label,
  options,
  error,
  placeholder,
  className,
  ...props
}: SelectProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div
        className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors focus-within:border-orange-500 ${
          error ? "border-red-500 bg-red-50" : "border-slate-200 bg-slate-50"
        }`}
      >
        {icon && <span className="shrink-0 text-slate-400">{icon}</span>}

        <select
          {...props}
          className={`w-full bg-transparent text-sm outline-none ${className ?? ""}`}
        >
          <option value="">{placeholder ?? `Select ${label}`}</option>

          {options.map((option) => {
            const value = getOptionValue(option);
            const labelText = getOptionLabel(option);

            return (
              <option key={value} value={value}>
                {labelText}
              </option>
            );
          })}
        </select>
      </div>

      {error && (
        <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}
