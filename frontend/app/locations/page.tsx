// app/dashboard/locations/page.tsx

import Link from "next/link";

import { MapPin, Plus, ArrowRight } from "lucide-react";

import LocationList from "@/components/locations/LocationList";

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-4 rounded-3xl border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-2xl bg-black p-3 text-white">
                <MapPin className="size-5" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Location Management
                </h1>

                <p className="mt-1 text-sm text-gray-500 sm:text-base">
                  Manage all company offices, gates, branches, and working
                  sites.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/locations/create"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-gray-900"
          >
            <Plus className="size-4" />
            Create Location
          </Link>
        </div>

        {/* ================= ACTION CARDS ================= */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* CREATE LOCATION */}
          <Link
            href="/locations/create"
            className="group overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-black text-white">
                  <Plus className="size-6" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Create Location
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Add new offices, gates, branches, warehouses, and employee
                    work sites.
                  </p>
                </div>
              </div>

              <ArrowRight className="size-5 text-gray-400 transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* VIEW LOCATIONS */}
          <Link
            href="/locations/view"
            className="group overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <MapPin className="size-6" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    View Locations
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Browse and manage all registered company locations in the
                    system.
                  </p>
                </div>
              </div>

              <ArrowRight className="size-5 text-gray-400 transition group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {/* ================= LOCATION LIST ================= */}
        <div
          id="locations"
          className="rounded-3xl border bg-white p-5 shadow-sm"
        >
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              All Locations
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              List of all active company locations.
            </p>
          </div>

          <LocationList />
        </div>
      </div>
    </div>
  );
}
