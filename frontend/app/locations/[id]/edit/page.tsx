"use client";

import { use } from "react";

import UpdateLocationForm from "@/components/locations/UpdateLocationForm";

export default function EditLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Update Location
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Edit and update location information.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <UpdateLocationForm id={id} />
        </div>
      </div>
    </main>
  );
}
