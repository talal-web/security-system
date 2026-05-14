import React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  icon?: React.ReactNode;
  label: string;
  options: string[];
  error?: string;
};

function formatText(text: string) {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
          {options.map((o) => (
            <option key={o} value={o}>
              {formatText(o)}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
