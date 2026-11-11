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
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div
        className={`flex h-10 items-center gap-2 rounded-lg border bg-white px-3 shadow-card transition-[border-color,box-shadow] focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-500/15 ${
          error ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-500/15" : "border-slate-200 hover:border-slate-300"
        }`}
      >
        {icon && (
          <span className="shrink-0 text-slate-400 [&_svg]:h-4 [&_svg]:w-4">
            {icon}
          </span>
        )}

        <select
          {...props}
          className={`w-full bg-transparent text-sm text-slate-900 outline-none disabled:cursor-not-allowed disabled:text-slate-400 ${className ?? ""}`}
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
