"use client";

import { useState } from "react";
import { CheckCircle2, CreditCard } from "lucide-react";
import RecalculatePayrollButton from "./RecalculatePayrollButton";
import FinalizePayrollDialog from "./FinalizePayrollDialog";
import MarkPayrollPaidDialog from "./MarkPayrollPaidDialog";
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
            <button
              type="button"
              onClick={() => setFinalizeOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Finalize
            </button>
          </>
        )}
        {payroll.status === "finalized" && (
          <button
            type="button"
            onClick={() => setPaymentOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <CreditCard className="h-4 w-4" />
            Mark paid
          </button>
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
