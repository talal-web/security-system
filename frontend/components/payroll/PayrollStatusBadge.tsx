import type { PayrollStatus } from "@/types/payroll";
import { STATUS_RING_PILL_CLASSES, type StatusTone } from "@/utils/ui/statusColors";

const STATUS_TONE: Record<PayrollStatus, StatusTone> = {
  draft: "warning",
  finalized: "info",
  paid: "success",
};

const styles: Record<PayrollStatus, string> = {
  draft: STATUS_RING_PILL_CLASSES[STATUS_TONE.draft],
  finalized: STATUS_RING_PILL_CLASSES[STATUS_TONE.finalized],
  paid: STATUS_RING_PILL_CLASSES[STATUS_TONE.paid],
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
