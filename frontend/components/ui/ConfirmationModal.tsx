"use client";

import { AlertTriangle, X } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  description: string;

  confirmText?: string;
  cancelText?: string;

  isLoading?: boolean;

  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  open,
  title,
  description,

  confirmText = "Confirm",
  cancelText = "Cancel",

  isLoading = false,

  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] animate-in fade-in duration-150"
        onClick={isLoading ? undefined : onCancel}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-50 ring-1 ring-inset ring-amber-200">
              <AlertTriangle className="size-5 text-amber-600" />
            </div>

            <div className="pr-6">
              <h2
                id="confirmation-modal-title"
                className="text-base font-semibold text-slate-900"
              >
                {title}
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3 sm:flex-row sm:justify-end sm:px-6">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>

          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
