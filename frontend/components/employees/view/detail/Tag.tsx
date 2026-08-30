import React from "react";

interface TagProps {
  icon: React.ReactNode;
  text?: React.ReactNode;
  className?: string;
}

export default function Tag({ icon, text, className = "" }: TagProps) {
  return (
    <div
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 ${className}`}
    >
      <span className="shrink-0">{icon}</span>

      <span className="truncate">
        {text ?? <span className="text-slate-400">Not provided</span>}
      </span>
    </div>
  );
}
