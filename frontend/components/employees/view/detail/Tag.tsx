import React from "react";

interface TagProps {
  icon: React.ReactNode;
  text?: React.ReactNode;
  className?: string;
}

export default function Tag({ icon, text, className = "" }: TagProps) {
  return (
    <div
      className={`inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-slate-200 backdrop-blur-md transition-all duration-300 hover:bg-white/20 sm:px-4 sm:text-sm ${className}`}
    >
      <span className="shrink-0">{icon}</span>

      <span className="truncate">
        {text ?? <span className="text-slate-400">Not Provided</span>}
      </span>
    </div>
  );
}
