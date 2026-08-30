"use client";

import Modal from "@/components/ui/Modal";

import type { Deduction } from "@/types/deduction";

interface DeductionConfirmModalProps {
  open: boolean;
  deduction: Deduction | null;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeductionConfirmModal({
  open,
  deduction,
  loading = false,
  onConfirm,
  onClose,
}: DeductionConfirmModalProps) {
  if (!deduction) return null;

  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      title="Cancel Deduction"
    >
      <div className="space-y-5">
        <div>
          <p className="text-sm leading-6 text-gray-600">
            Are you sure you want to cancel this deduction of{" "}
            <span className="font-semibold text-gray-900">
              Rs. {deduction.amount.toLocaleString()}
            </span>
            ?
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-900">
            {deduction.reason}
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            This action is only available before any deduction has been
            processed.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Keep Deduction
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {loading ? "Cancelling..." : "Cancel Deduction"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
