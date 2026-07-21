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
      <label className="mb-1 block text-sm font-medium">{label}</label>

      <div className="flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2 focus-within:border-orange-500">
        {icon && <span className="text-gray-400">{icon}</span>}

        <input
          {...props}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none placeholder:text-gray-400"
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
