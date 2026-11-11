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
      className={`flex h-full gap-3 rounded-lg border border-slate-200/80 bg-slate-50/60 p-3 ${className}`}
    >
      {/* Icon */}
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 [&_svg]:size-4">
        {icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>

        <div
          className={`mt-0.5 text-sm font-medium text-slate-900 ${
            large ? "whitespace-pre-wrap leading-6" : "truncate"
          }`}
        >
          {value ?? (
            <span className="font-normal text-slate-400">Not provided</span>
          )}
        </div>
      </div>
    </div>
  );
}
