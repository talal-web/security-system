"use client";

import Image from "next/image";
import { useState } from "react";
import { Download, Eye, FileImage, X } from "lucide-react";

import { Button } from "@/components/ui/Button";

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
      <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
            <FileImage className="size-4" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-slate-900">
              {title}
            </h3>

            <p className="text-xs text-slate-500">
              {imageUrl ? "Document available" : "Not provided"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Preview */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePreview}
            disabled={!imageUrl}
            aria-label={`Preview ${title}`}
          >
            <Eye />
            <span>Preview</span>
          </Button>

          {/* Download */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            disabled={!imageUrl}
            aria-label={`Download ${title}`}
          >
            <Download />
            <span>Download</span>
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      {open && imageUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} preview`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-3 sm:p-6"
          onClick={handleClose}
        >
          <div
            className="relative flex h-[85vh] w-full max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop sm:h-[90vh]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Close Button */}
            <Button
              variant="secondary"
              size="icon"
              onClick={handleClose}
              aria-label="Close preview"
              className="absolute right-3 top-3 z-20"
            >
              <X />
            </Button>

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
