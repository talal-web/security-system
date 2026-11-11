"use client";

import { Button } from "@/components/ui/Button";
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
        <p className="text-sm leading-6 text-slate-600">
          Are you sure you want to cancel this fine of{" "}
          <span className="font-semibold tabular-nums text-slate-900">
            Rs. {fine.amount.toLocaleString()}
          </span>
          ?
        </p>

        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <p className="break-words text-sm font-medium text-slate-900">
            {fine.reason}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            This action is only available before any deduction.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Keep Fine
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Cancelling..." : "Cancel Fine"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
