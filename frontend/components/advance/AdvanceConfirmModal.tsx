"use client";

import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface AdvanceConfirmModalProps {
  open: boolean;
  amount: number;
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function AdvanceConfirmModal({
  open,
  amount,
  pending = false,
  onConfirm,
  onClose,
}: AdvanceConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Cancel Advance">
      <div className="space-y-5">
        <p className="text-sm leading-6 text-slate-600">
          Are you sure you want to cancel the advance of Rs.{" "}
          {amount.toLocaleString()}? This action cannot be undone.
        </p>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={pending}
            className="w-full sm:w-auto"
          >
            Keep Advance
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={pending}
            className="w-full sm:w-auto"
          >
            {pending ? "Cancelling..." : "Cancel Advance"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
