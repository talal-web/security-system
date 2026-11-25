const moneyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatMoney = (value: number) => moneyFormatter.format(value);

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

// "2026-11" -> "November 2026"
export const formatMonthKey = (year: number, month: number) =>
  monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)));

// ISO timestamp or YYYY-MM-DD -> "15 Nov 2026" (UTC, matching how entries are stored)
const dayFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export const formatDay = (iso: string) => dayFormatter.format(new Date(iso));
