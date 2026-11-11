import { cn } from "@/lib/utils";

export type Segment = {
  label: string;
  value: number;
  /** Tailwind background class for the segment and its legend dot. */
  color: string;
};

interface SegmentedBarProps {
  segments: Segment[];
  /** Formats legend values (defaults to locale number). */
  format?: (value: number) => string;
  emptyLabel?: string;
  className?: string;
}

/**
 * Part-of-whole bar with a labelled legend. Each segment shows its share on
 * hover, and the legend always carries the label + value so identity never
 * relies on color alone.
 */
export function SegmentedBar({
  segments,
  format = (value) => value.toLocaleString(),
  emptyLabel = "No data yet",
  className,
}: SegmentedBarProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const pct = (value: number) => (total ? Math.round((value / total) * 100) : 0);

  return (
    <div className={className}>
      <div
        role="img"
        aria-label={
          total
            ? segments.map((s) => `${s.label}: ${format(s.value)} (${pct(s.value)}%)`).join(", ")
            : emptyLabel
        }
        className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full bg-slate-100"
      >
        {total > 0 &&
          segments
            .filter((segment) => segment.value > 0)
            .map((segment) => (
              <div
                key={segment.label}
                title={`${segment.label}: ${format(segment.value)} (${pct(segment.value)}%)`}
                className={cn("h-full transition-[width] duration-500 first:rounded-l-full last:rounded-r-full", segment.color)}
                style={{ width: `${(segment.value / total) * 100}%` }}
              />
            ))}
      </div>

      {total === 0 ? (
        <p className="mt-3 text-xs text-slate-500">{emptyLabel}</p>
      ) : (
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          {segments.map((segment) => (
            <li key={segment.label} className="flex min-w-0 items-center gap-2 text-xs">
              <span className={cn("size-2 shrink-0 rounded-full", segment.color)} aria-hidden />
              <span className="truncate text-slate-500">{segment.label}</span>
              <span className="ml-auto font-medium tabular-nums text-slate-900">
                {format(segment.value)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SegmentedBar;
