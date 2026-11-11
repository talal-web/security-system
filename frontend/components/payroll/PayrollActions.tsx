"use client";

import { useState } from "react";
import { CheckCircle2, CreditCard } from "lucide-react";
import RecalculatePayrollButton from "./RecalculatePayrollButton";
import FinalizePayrollDialog from "./FinalizePayrollDialog";
import MarkPayrollPaidDialog from "./MarkPayrollPaidDialog";
import { Button } from "@/components/ui/Button";
import type { Payroll } from "@/types/payroll";

export default function PayrollActions({
  payroll,
  canManage,
}: {
  payroll: Payroll;
  canManage: boolean;
}) {
  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  if (!canManage || payroll.status === "paid") return null;
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {payroll.status === "draft" && (
          <>
            <RecalculatePayrollButton payrollId={payroll._id} />
            <Button size="sm" onClick={() => setFinalizeOpen(true)}>
              <CheckCircle2 />
              Finalize
            </Button>
          </>
        )}
        {payroll.status === "finalized" && (
          <Button size="sm" onClick={() => setPaymentOpen(true)}>
            <CreditCard />
            Mark paid
          </Button>
        )}
      </div>
      <FinalizePayrollDialog
        open={finalizeOpen}
        payrollId={payroll._id}
        onClose={() => setFinalizeOpen(false)}
      />
      <MarkPayrollPaidDialog
        open={paymentOpen}
        payrollId={payroll._id}
        onClose={() => setPaymentOpen(false)}
      />
    </>
  );
}
