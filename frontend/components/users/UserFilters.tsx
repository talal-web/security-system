"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
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

const controlClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-card placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15";

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
    <Card>
      <CardContent className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search by name or user ID"
            className={`${controlClass} pl-9`}
          />
        </label>
        <select
          value={role}
          onChange={(event) => onRole(event.target.value as UserRole | "all")}
          className={`${controlClass} md:w-44`}
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
          className={`${controlClass} md:w-44`}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {(search || role !== "all" || status !== "all") && (
          <Button
            variant="ghost"
            onClick={() => {
              onSearch("");
              onRole("all");
              onStatus("all");
            }}
          >
            <X /> Clear
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
