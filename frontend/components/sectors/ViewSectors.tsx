"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  CheckCircle2,
  CircleOff,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";

import { useDebounce } from "@/hooks/employee/useDebounce";
import { useSectors } from "@/hooks/sector/useSector";

type StatusFilter = "all" | "active" | "inactive";

export default function ViewSectors() {
  // =========================================================
  // STATE
  // =========================================================

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // =========================================================
  // DEBOUNCED SEARCH
  // =========================================================

  const debouncedSearch = useDebounce(searchValue, 350);

  // =========================================================
  // QUERY PARAMS
  // =========================================================

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch.trim() || undefined,

      isActive: statusFilter === "all" ? undefined : statusFilter === "active",
    }),
    [debouncedSearch, statusFilter],
  );

  // =========================================================
  // QUERY
  // =========================================================

  const {
    data: sectorResponse,
    isLoading,
    isError,
    isFetching,
  } = useSectors(queryParams);

  const sectors = sectorResponse?.data ?? [];

  // =========================================================
  // STATISTICS
  // =========================================================

  const activeCount = sectors.filter((sector) => sector.isActive).length;

  const inactiveCount = sectors.length - activeCount;

  // =========================================================
  // FILTER STATE
  // =========================================================

  const hasFilters = searchValue.trim() !== "" || statusFilter !== "all";

  const resetFilters = () => {
    setSearchValue("");
    setStatusFilter("all");
  };

  // =========================================================
  // DATE FORMATTER
  // =========================================================

  const formatDate = (date?: string) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // INITIAL LOADING
  //
  // Important:
  // Only show the skeleton when there is no existing data.
  // During search/filter changes, previous data remains visible.
  // =========================================================

  const isInitialLoading = isLoading && !sectorResponse;

  if (isInitialLoading) {
    return (
      <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="animate-pulse space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              <div className="space-y-3">
                <div className="h-10 w-56 rounded-xl bg-slate-200" />
                <div className="h-4 w-72 rounded-lg bg-slate-200" />
              </div>

              <div className="h-11 w-full rounded-xl bg-slate-200 sm:w-40" />
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="h-24 rounded-2xl bg-white shadow-sm" />
              <div className="h-24 rounded-2xl bg-white shadow-sm" />
              <div className="h-24 rounded-2xl bg-white shadow-sm" />
            </div>

            {/* Filters */}
            <div className="h-20 rounded-2xl bg-white shadow-sm" />

            {/* Table */}
            <div className="h-96 rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // INITIAL ERROR
  //
  // If we already have cached/previous data, don't destroy
  // the existing UI just because a background request failed.
  // =========================================================

  if (isError && !sectorResponse) {
    return (
      <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-100 w-full max-w-7xl items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <CircleOff size={22} className="text-red-500" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Failed to load sectors
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Something went wrong while loading the sector data. Please try
              again.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <RotateCcw size={15} />
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                  <Activity size={20} />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Sectors
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage your organization sectors and their status.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/sectors/create"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <Plus size={17} />
              Create Sector
            </Link>
          </div>
        </section>

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total Sectors
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {sectors.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Activity size={19} className="text-slate-600" />
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Active
                </p>

                <p className="mt-2 text-2xl font-bold text-green-600">
                  {activeCount}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                <CheckCircle2 size={19} className="text-green-600" />
              </div>
            </div>
          </div>

          {/* Inactive */}
          <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Inactive
                </p>

                <p className="mt-2 text-2xl font-bold text-red-600">
                  {inactiveCount}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <CircleOff size={19} className="text-red-600" />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FILTERS
        ===================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}
            <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-lg border border-slate-300 bg-white px-3.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 sm:h-11 sm:rounded-xl">
              <Search size={17} className="shrink-0 text-slate-400" />

              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search by sector name or code..."
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-[15px] leading-6 text-slate-800 outline-none placeholder:text-slate-400"
              />
            </label>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-52"
            >
              <option value="all">All Statuses</option>

              <option value="active">Active</option>

              <option value="inactive">Inactive</option>
            </select>

            {/* Reset */}
            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasFilters}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:rounded-xl lg:w-auto"
            >
              <RotateCcw size={15} />
              Reset
            </button>
          </div>

          {/* Background fetching indicator */}
          {isFetching && (
            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-blue-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
              Updating sectors...
            </div>
          )}
        </section>

        {/* =====================================================
            SECTOR LIST
        ===================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {sectors.length === 0 ? (
            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="px-5 py-16 text-center sm:px-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <Search size={22} className="text-slate-400" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                No sectors found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {hasFilters
                  ? "No sectors match your current search or filters. Try changing your criteria."
                  : "You have not created any sectors yet. Create your first sector to get started."}
              </p>

              <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
                {hasFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <RotateCcw size={15} />
                    Clear Filters
                  </button>
                )}

                <Link
                  href="/sectors/create"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus size={15} />
                  Create Sector
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* =================================================
                  DESKTOP TABLE
              ================================================= */}

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Sector
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Code
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Description
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Created
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {sectors.map((sector) => (
                      <tr
                        key={sector._id}
                        className="group transition hover:bg-slate-50"
                      >
                        {/* Sector */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
                              {sector.name?.charAt(0)?.toUpperCase() || "S"}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900">
                                {sector.name}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                Sector
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Code */}
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700">
                            {sector.code}
                          </span>
                        </td>

                        {/* Description */}
                        <td className="max-w-sm px-5 py-4">
                          <p
                            title={sector.description || undefined}
                            className="truncate text-sm text-slate-600"
                          >
                            {sector.description || "No description"}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                              sector.isActive
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                sector.isActive ? "bg-green-500" : "bg-red-500"
                              }`}
                            />

                            {sector.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Created */}
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                          {formatDate(sector.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/sectors/${sector._id}/edit`}
                              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <Pencil size={14} />
                              Edit
                            </Link>

                            <Link
                              href={`/sectors/${sector._id}/delete`}
                              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                              Delete
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* =================================================
                  MOBILE CARDS
              ================================================= */}

              <div className="divide-y divide-slate-100 md:hidden">
                {sectors.map((sector) => (
                  <article key={sector._id} className="p-4 sm:p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                          {sector.name?.charAt(0)?.toUpperCase() || "S"}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-900">
                            {sector.name}
                          </h3>

                          <p className="mt-0.5 font-mono text-xs text-slate-500">
                            {sector.code}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                          sector.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            sector.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        />

                        {sector.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Information */}
                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          Created
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {formatDate(sector.createdAt)}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          Description
                        </p>

                        <p
                          title={sector.description || undefined}
                          className="mt-1 truncate text-sm font-medium text-slate-700"
                        >
                          {sector.description || "No description"}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        href={`/sectors/${sector._id}/edit`}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil size={15} />
                        Edit
                      </Link>

                      <Link
                        href={`/sectors/${sector._id}/delete`}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                        Delete
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
