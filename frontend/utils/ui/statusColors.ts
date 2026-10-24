// Shared semantic status-color tones. Every status badge in the app should
// resolve to one of these tones instead of picking a color family ad hoc, so
// "success" always looks the same whether it's an attendance, employee, or
// payroll status.

export type StatusTone = "success" | "danger" | "warning" | "info" | "neutral";

// Bordered pill: `border {border} bg-{bg} text-{text}` (e.g. employee/attendance badges).
export const STATUS_PILL_CLASSES: Record<StatusTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  neutral: "border-slate-200 bg-slate-100 text-slate-700",
};

// Ring pill: `bg-{bg} text-{text} ring-1 ring-inset ring-{ring}` (e.g. payroll status badge).
export const STATUS_RING_PILL_CLASSES: Record<StatusTone, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  danger: "bg-red-50 text-red-700 ring-red-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  info: "bg-blue-50 text-blue-700 ring-blue-600/20",
  neutral: "bg-slate-100 text-slate-700 ring-slate-600/10",
};

// Soft background pill, no border: `bg-{bg} text-{text}`.
export const STATUS_SOFT_PILL_CLASSES: Record<StatusTone, string> = {
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-blue-100 text-blue-700",
  neutral: "bg-slate-100 text-slate-700",
};

// Dot/indicator color to pair with STATUS_PILL_CLASSES.
export const STATUS_DOT_CLASSES: Record<StatusTone, string> = {
  success: "text-emerald-400",
  danger: "text-red-400",
  warning: "text-amber-400",
  info: "text-blue-400",
  neutral: "text-slate-400",
};
