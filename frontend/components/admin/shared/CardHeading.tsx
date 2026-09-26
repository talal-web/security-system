import type { LucideIcon } from "lucide-react";

import { toneStyles } from "@/components/admin/dashboard.config";
import type { Tone } from "@/components/admin/dashboard.types";

type CardHeadingProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: Tone;
};

export default function CardHeading({
  title,
  description,
  icon: Icon,
  tone,
}: CardHeadingProps) {
  const styles = toneStyles[tone];

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>

        <p className="mt-0.5 truncate text-[11px] text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}
