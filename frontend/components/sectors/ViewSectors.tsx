"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  CheckCircle2,
  CircleOff,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";

import { useDebounce } from "@/hooks/employee/useDebounce";
import { useSectors } from "@/hooks/sector/useSector";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState, Skeleton } from "@/components/ui/States";

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
      <PageContainer>
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>

          <Skeleton className="h-9 w-full sm:w-36" />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>

        {/* Filters */}
        <Skeleton className="h-20 rounded-xl" />

        {/* Table */}
        <Skeleton className="h-96 rounded-xl" />
      </PageContainer>
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
      <PageContainer>
        <div className="flex min-h-100 items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="py-8 text-center sm:py-10">
              <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-inset ring-red-100">
                <CircleOff className="size-5" />
              </div>

              <h2 className="mt-4 text-base font-semibold text-slate-900">
                Failed to load sectors
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                Something went wrong while loading the sector data. Please try
                again.
              </p>

              <Button
                onClick={() => window.location.reload()}
                className="mt-5"
              >
                <RotateCcw />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <PageContainer>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <PageHeader
        title="Sectors"
        description="Manage your organization sectors and their status."
        icon={Activity}
        actions={
          <ButtonLink href="/sectors/create">
            <Plus />
            Create Sector
          </ButtonLink>
        }
      />

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="grid grid-cols-3 gap-3">
        <StatCard
          label="Total Sectors"
          value={sectors.length}
          icon={Activity}
          tone="slate"
        />

        <StatCard
          label="Active"
          value={activeCount}
          icon={CheckCircle2}
          tone="emerald"
        />

        <StatCard
          label="Inactive"
          value={inactiveCount}
          icon={CircleOff}
          tone="red"
        />
      </section>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <Card>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 shadow-card transition-[border-color,box-shadow] hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-500/15">
              <Search className="size-4 shrink-0 text-slate-400" />

              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search by sector name or code..."
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-card outline-none transition-[border-color,box-shadow] hover:border-slate-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 sm:w-48"
            >
              <option value="all">All Statuses</option>

              <option value="active">Active</option>

              <option value="inactive">Inactive</option>
            </select>

            {/* Reset */}
            <Button
              variant="secondary"
              onClick={resetFilters}
              disabled={!hasFilters}
              className="w-full sm:w-auto"
            >
              <RotateCcw />
              Reset
            </Button>
          </div>

          {/* Background fetching indicator */}
          {isFetching && (
            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-blue-600">
              <Loader2 className="size-3.5 animate-spin" />
              Updating sectors...
            </div>
          )}
        </CardContent>
      </Card>

      {/* =====================================================
          SECTOR LIST
      ===================================================== */}

      {sectors.length === 0 ? (
        /* =================================================
           EMPTY STATE
        ================================================= */

        <EmptyState
          icon={Search}
          title="No sectors found"
          description={
            hasFilters
              ? "No sectors match your current search or filters. Try changing your criteria."
              : "You have not created any sectors yet. Create your first sector to get started."
          }
          action={
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              {hasFilters && (
                <Button variant="secondary" onClick={resetFilters}>
                  <RotateCcw />
                  Clear Filters
                </Button>
              )}

              <ButtonLink href="/sectors/create">
                <Plus />
                Create Sector
              </ButtonLink>
            </div>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full">
              <thead className="border-b border-slate-200/80 bg-slate-50/80">
                <tr className="text-xs font-medium text-slate-500">
                  <th className="px-4 py-3 text-left font-medium">Sector</th>

                  <th className="px-4 py-3 text-left font-medium">Code</th>

                  <th className="px-4 py-3 text-left font-medium">
                    Description
                  </th>

                  <th className="px-4 py-3 text-left font-medium">Status</th>

                  <th className="px-4 py-3 text-left font-medium">Created</th>

                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {sectors.map((sector) => (
                  <tr
                    key={sector._id}
                    className="group transition-colors hover:bg-slate-50/60"
                  >
                    {/* Sector */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-semibold text-blue-600 ring-1 ring-inset ring-blue-100">
                          {sector.name?.charAt(0)?.toUpperCase() || "S"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {sector.name}
                          </p>

                          <p className="text-xs text-slate-400">Sector</p>
                        </div>
                      </div>
                    </td>

                    {/* Code */}
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-500/15">
                        {sector.code}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="max-w-sm px-4 py-3">
                      <p
                        title={sector.description || undefined}
                        className="truncate text-sm text-slate-600"
                      >
                        {sector.description || "No description"}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <Badge
                        tone={sector.isActive ? "success" : "danger"}
                        dot
                      >
                        {sector.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>

                    {/* Created */}
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                      {formatDate(sector.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <ButtonLink
                          href={`/sectors/${sector._id}/edit`}
                          variant="secondary"
                          size="sm"
                        >
                          <Pencil />
                          Edit
                        </ButtonLink>

                        <ButtonLink
                          href={`/sectors/${sector._id}/delete`}
                          variant="danger-soft"
                          size="sm"
                        >
                          <Trash2 />
                          Delete
                        </ButtonLink>
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
              <article key={sector._id} className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-100">
                      {sector.name?.charAt(0)?.toUpperCase() || "S"}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-medium text-slate-900">
                        {sector.name}
                      </h3>

                      <p className="mt-0.5 font-mono text-xs text-slate-500">
                        {sector.code}
                      </p>
                    </div>
                  </div>

                  <Badge
                    tone={sector.isActive ? "success" : "danger"}
                    dot
                    className="shrink-0"
                  >
                    {sector.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Information */}
                <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                  <div>
                    <p className="text-xs text-slate-500">Created</p>

                    <p className="mt-0.5 text-sm font-medium text-slate-700">
                      {formatDate(sector.createdAt)}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Description</p>

                    <p
                      title={sector.description || undefined}
                      className="mt-0.5 truncate text-sm font-medium text-slate-700"
                    >
                      {sector.description || "No description"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <ButtonLink
                    href={`/sectors/${sector._id}/edit`}
                    variant="secondary"
                  >
                    <Pencil />
                    Edit
                  </ButtonLink>

                  <ButtonLink
                    href={`/sectors/${sector._id}/delete`}
                    variant="danger-soft"
                  >
                    <Trash2 />
                    Delete
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>
        </Card>
      )}
    </PageContainer>
  );
}
