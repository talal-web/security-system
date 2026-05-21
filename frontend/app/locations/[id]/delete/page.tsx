"use client";

import { use } from "react";

import DeleteLocationButton from "@/components/locations/DeleteLocationButton";

export default function DeleteLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Delete Location
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              This action cannot be undone. Please confirm before deleting this
              location.
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-red-100 bg-red-50 p-5">
            <div>
              <h2 className="font-semibold text-red-700">
                Are you sure you want to delete this location?
              </h2>

              <p className="mt-1 text-sm text-red-600">
                Deleting this location may affect related records in the system.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <DeleteLocationButton id={id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
