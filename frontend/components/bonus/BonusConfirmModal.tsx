"use client";

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
          <span className="font-semibold text-slate-900">
            Rs. {bonus.amount.toLocaleString()}
          </span>
          ?
        </p>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-900">{bonus.reason}</p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            This action is only available while the bonus is pending.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Keep Bonus
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {loading ? "Cancelling..." : "Cancel Bonus"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
