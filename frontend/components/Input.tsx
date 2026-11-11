import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  label: string;
  placeholder?: string;
  error?: string;
};

export default function Input({
  icon,
  label,
  placeholder,
  error,
  ...props
}: InputProps) {
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

        <input
          {...props}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:text-slate-400"
        />
      </div>

      {error && (
        <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}
