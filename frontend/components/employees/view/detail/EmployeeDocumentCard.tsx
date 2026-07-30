"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, Download } from "lucide-react";

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

  if (!imageUrl) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
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
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <>
      {/* Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">{title}</h3>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Eye className="h-4 w-4 shrink-0" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative flex h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-lg text-white transition hover:bg-black"
            >
              ✕
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
