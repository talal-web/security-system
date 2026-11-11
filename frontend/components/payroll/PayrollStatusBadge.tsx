import type { PayrollStatus } from "@/types/payroll";
import type { StatusTone } from "@/utils/ui/statusColors";
import { Badge } from "@/components/ui/Badge";

const STATUS_TONE: Record<PayrollStatus, StatusTone> = {
  draft: "warning",
  finalized: "info",
  paid: "success",
};

export default function PayrollStatusBadge({
  status,
}: {
  status: PayrollStatus;
}) {
  return (
    <Badge tone={STATUS_TONE[status]} dot className="capitalize">
      {status}
    </Badge>
  );
}
