"use client";

import Modal from "@/components/ui/Modal";
import type { Fine } from "@/types/fine";

interface FineConfirmModalProps {
  open: boolean;
  fine: Fine | null;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function FineConfirmModal({
  open,
  fine,
  loading = false,
  onConfirm,
  onClose,
}: FineConfirmModalProps) {
  if (!fine) return null;

  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      title="Cancel Fine"
    >
      <div className="space-y-5">
        <p className="text-sm leading-6 text-gray-600">
          Are you sure you want to cancel this fine of{" "}
          <span className="font-semibold text-gray-900">
            Rs. {fine.amount.toLocaleString()}
          </span>
          ?
        </p>

        <div className="rounded-xl bg-gray-50 p-4 text-sm">
          <p className="font-medium text-gray-900">{fine.reason}</p>

          <p className="mt-1 text-gray-500">
            This action is only available before any deduction.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full rounded-xl border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
          >
            Keep Fine
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 sm:w-auto"
          >
            {loading ? "Cancelling..." : "Cancel Fine"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
