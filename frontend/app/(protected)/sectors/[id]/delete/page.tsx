"use client";

import Link from "next/link";
import { use } from "react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DeleteSectorButton from "@/components/sectors/DeleteSectorButton";

export default function DeleteSectorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <ProtectedRoute allowedRoles={["admin", "developer"]}>
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Delete Sector
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                This action cannot be undone. Please confirm before deleting
                this sector.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-red-100 bg-red-50 p-5">
              <div>
                <h2 className="font-semibold text-red-700">
                  Are you sure you want to delete this sector?
                </h2>

                <p className="mt-1 text-sm text-red-600">
                  If this sector still has assigned locations, deletion will be
                  blocked by the backend.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <DeleteSectorButton id={id} />

                <Link
                  href="/sectors/view"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
