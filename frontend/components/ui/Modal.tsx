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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/55 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Dialog"}
        onClick={(e) => e.stopPropagation()}
        className={`relative my-auto max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto ${size === "2xl" ? "max-w-xl" : "max-w-md"} rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 sm:max-h-[calc(100dvh-3rem)] sm:rounded-3xl`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
        >
          <X size={20} />
        </button>

        {title && (
          <div className="border-b border-slate-100 px-5 py-4 pr-14 sm:px-6 sm:py-5">
            <h2 className="text-lg font-bold leading-6 text-slate-950 sm:text-xl">{title}</h2>
          </div>
        )}

        <div className={contentClassName}>{children}</div>
      </div>
    </div>
  );
}
