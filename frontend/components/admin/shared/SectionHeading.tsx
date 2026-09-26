import type { LucideIcon } from "lucide-react";

type SectionHeadingProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
};

export default function SectionHeading({
  title,
  description,
  icon: Icon,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`flex items-start justify-between gap-3 ${className}`}>
      <div>
        <h2 className="text-sm font-bold text-slate-900 sm:text-base">
          {title}
        </h2>

        <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
          {description}
        </p>
      </div>

      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
    </div>
  );
}
