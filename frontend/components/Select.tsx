import React from "react";

type SelectOption = string | { label: string; value: string };

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  icon?: React.ReactNode;
  label: string;
  options: SelectOption[];
  error?: string;
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
  ...props
}: SelectProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>

      <div className="flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2 focus-within:border-orange-500">
        {icon && <span className="text-gray-400">{icon}</span>}

        <select {...props} className="w-full bg-transparent outline-none">
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

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
