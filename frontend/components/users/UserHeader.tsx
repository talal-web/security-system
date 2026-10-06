"use client";

import { Plus } from "lucide-react";

export default function UserHeader({ onAddUser }: { onAddUser: () => void }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
          Access control
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          Users
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage accounts, roles, and access status.
        </p>
      </div>
      <button
        type="button"
        onClick={onAddUser}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" /> Add user
      </button>
    </div>
  );
}
