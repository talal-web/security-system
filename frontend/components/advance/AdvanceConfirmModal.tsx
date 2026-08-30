"use client";

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
        <p className="text-sm leading-6 text-gray-600">
          Are you sure you want to cancel the advance of Rs.{" "}
          {amount.toLocaleString()}? This action cannot be undone.
        </p>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Keep Advance
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {pending ? "Cancelling..." : "Cancel Advance"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
