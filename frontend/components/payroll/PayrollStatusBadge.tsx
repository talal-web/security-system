import type { PayrollStatus } from "@/types/payroll";

const styles: Record<PayrollStatus, string> = {
  draft: "bg-amber-50 text-amber-700 ring-amber-600/20",
  finalized: "bg-blue-50 text-blue-700 ring-blue-600/20",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

export default function PayrollStatusBadge({
  status,
}: {
  status: PayrollStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${styles[status]}`}
    >
      {status}
    </span>
  );
}
