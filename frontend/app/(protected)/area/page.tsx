"use client";

import { useState } from "react";
import { Plus, MapPin } from "lucide-react";

import AreaCreateModal from "@/components/area/AreaModal";
import AreaList from "@/components/area/AreaList";

export default function AreaPage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-full bg-slate-50/70">
      <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-5 sm:space-y-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 sm:h-12 sm:w-12">
              <MapPin size={22} />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                Areas
              </h1>
              <p className="mt-1 text-sm leading-5 text-slate-500 sm:text-base">
                Manage your operational areas and locations.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-auto"
          >
            <Plus size={18} />
            Add Area
          </button>
        </div>

        {/* Main content */}
        <section className="min-w-0">
          <AreaList />
        </section>

        {/* Create modal */}
        <AreaCreateModal open={open} onClose={() => setOpen(false)} />
      </div>
    </main>
  );
}
