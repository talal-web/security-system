"use client";

import { Activity, Code2 } from "lucide-react";

export default function DeveloperHeader() {
  return (
    <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
        {/* LEFT */}
        <div className="flex items-start gap-4">
          <div className="rounded-3xl bg-slate-900 p-4 text-white shadow-lg">
            <Code2 className="h-8 w-8" />
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Developer Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Monitor modules, manage resources, and maintain the attendance
              management system.
            </p>
          </div>
        </div>

        {/* STATUS */}
        <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-500 p-2 text-white">
              <Activity className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                System Status
              </p>

              <h2 className="text-lg font-bold text-green-900">Operational</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
