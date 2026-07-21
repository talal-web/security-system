import React from "react";

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  large?: boolean;
  className?: string;
}

export default function InfoCard({
  icon,
  label,
  value,
  large = false,
  className = "",
}: InfoCardProps) {
  return (
    <div
      className={`group flex h-full gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg ${className}`}
    >
      {/* Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white transition-transform duration-300 group-hover:scale-105">
        {icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>

        <div
          className={`mt-2 text-[15px] font-semibold text-slate-900 ${
            large ? "wrap-break-word whitespace-pre-wrap leading-7" : "truncate"
          }`}
        >
          {value ?? (
            <span className="font-normal text-slate-400">Not Provided</span>
          )}
        </div>
      </div>
    </div>
  );
}
