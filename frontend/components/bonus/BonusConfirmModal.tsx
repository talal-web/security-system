"use client";

import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

import type { Bonus } from "@/types/bonus";

interface BonusConfirmModalProps {
  open: boolean;
  bonus: Bonus | null;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function BonusConfirmModal({
  open,
  bonus,
  loading = false,
  onConfirm,
  onClose,
}: BonusConfirmModalProps) {
  if (!bonus) return null;

  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      title="Cancel Bonus"
    >
      <div className="space-y-5">
        <p className="text-sm leading-6 text-slate-600">
          Are you sure you want to cancel this bonus of{" "}
          <span className="font-semibold tabular-nums text-slate-900">
            Rs. {bonus.amount.toLocaleString()}
          </span>
          ?
        </p>

        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <p className="break-words text-sm font-medium text-slate-900">
            {bonus.reason}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            This action is only available while the bonus is pending.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Keep Bonus
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Cancelling..." : "Cancel Bonus"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
