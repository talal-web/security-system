"use client";

import { Search, X } from "lucide-react";
import type { UserRole } from "@/types/user";

type StatusFilter = "all" | "active" | "inactive";
interface Props {
  search: string;
  role: UserRole | "all";
  status: StatusFilter;
  onSearch: (value: string) => void;
  onRole: (value: UserRole | "all") => void;
  onStatus: (value: StatusFilter) => void;
}

export default function UserFilters({
  search,
  role,
  status,
  onSearch,
  onRole,
  onStatus,
}: Props) {
  const roles: UserRole[] = ["developer", "admin", "clerk", "supervisor"];
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
      <label className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search by name or user ID"
          className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
        />
      </label>
      <select
        value={role}
        onChange={(event) => onRole(event.target.value as UserRole | "all")}
        className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
      >
        <option value="all">All roles</option>
        {roles.map((item) => (
          <option key={item} value={item}>
            {item[0].toUpperCase() + item.slice(1)}
          </option>
        ))}
      </select>
      <select
        value={status}
        onChange={(event) => onStatus(event.target.value as StatusFilter)}
        className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
      >
        <option value="all">All statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      {(search || role !== "all" || status !== "all") && (
        <button
          type="button"
          onClick={() => {
            onSearch("");
            onRole("all");
            onStatus("all");
          }}
          className="inline-flex items-center justify-center gap-1 rounded-xl border px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          <X className="h-4 w-4" /> Clear
        </button>
      )}
    </div>
  );
}
