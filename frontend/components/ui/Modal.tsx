"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: "md" | "2xl";
  contentClassName?: string;
  children: ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  size = "md",
  contentClassName = "p-6",
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-3 backdrop-blur-[2px] animate-in fade-in duration-150 sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Dialog"}
        onClick={(e) => e.stopPropagation()}
        className={`relative my-auto max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto ${size === "2xl" ? "max-w-xl" : "max-w-md"} rounded-xl border border-slate-200 bg-white shadow-pop animate-in fade-in zoom-in-95 duration-200 sm:max-h-[calc(100dvh-3rem)]`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={16} />
        </button>

        {title && (
          <div className="border-b border-slate-100 px-5 py-4 pr-14 sm:px-6">
            <h2 className="text-base font-semibold leading-6 text-slate-900">{title}</h2>
          </div>
        )}

        <div className={contentClassName}>{children}</div>
      </div>
    </div>
  );
}
