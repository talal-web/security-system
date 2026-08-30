"use client";

import Image from "next/image";
import { useState } from "react";
import { Download, Eye, FileImage, X } from "lucide-react";

type Props = {
  title: string;
  imageUrl?: string;
  fileName: string;
};

export default function EmployeeDocumentCard({
  title,
  imageUrl,
  fileName,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error("Failed to download document");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handlePreview = () => {
    if (!imageUrl) return;
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Card */}
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <FileImage className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-800">
              {title}
            </h3>

            <p className="text-xs text-slate-500">
              {imageUrl ? "Document available" : "Not provided"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Preview */}
          <button
            type="button"
            onClick={handlePreview}
            disabled={!imageUrl}
            aria-label={`Preview ${title}`}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Eye className="h-4 w-4 shrink-0" />
            <span>Preview</span>
          </button>

          {/* Download */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={!imageUrl}
            aria-label={`Download ${title}`}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-600 px-3 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {open && imageUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} preview`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6"
          onClick={handleClose}
        >
          <div
            className="relative flex h-[85vh] w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl sm:h-[90vh]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close preview"
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white transition hover:bg-slate-700"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Image */}
            <div className="relative h-full w-full">
              <Image
                src={imageUrl}
                alt={title}
                fill
                unoptimized
                className="object-contain p-2 sm:p-4"
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
