import Link from "next/link";
import { ArrowLeft, KeyRound, Pencil, Shield } from "lucide-react";
import type { User } from "@/types/user";
export default function UserDetails({
  user,
  isSelf = false,
  onRole,
  onPassword,
  onStatus,
  onDelete,
}: {
  user: User;
  isSelf?: boolean;
  onRole: () => void;
  onPassword: () => void;
  onStatus: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link
        href="/users"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to users
      </Link>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-700">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-950">{user.name}</h1>
              <p className="text-sm text-slate-500">{user.userId}</p>
            </div>
          </div>
          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
          >
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <dl className="mt-8 grid gap-5 border-t pt-5 sm:grid-cols-2">
          <Info label="Role" value={user.role} />
          <Info
            label="Created"
            value={new Date(user.createdAt).toLocaleDateString()}
          />
          <Info
            label="Last login"
            value={
              user.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleString()
                : "Never"
            }
          />
          <Info
            label="Updated"
            value={new Date(user.updatedAt).toLocaleDateString()}
          />
        </dl>
        <div className="mt-8 flex flex-wrap gap-3 border-t pt-5">
          <Link
            href={`/users/${user._id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Pencil className="h-4 w-4" /> Edit profile
          </Link>
          <button
            type="button"
            onClick={onRole}
            disabled={isSelf}
            title={isSelf ? "You cannot change your own role" : undefined}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Shield className="h-4 w-4" /> Change role
          </button>
          <button
            type="button"
            onClick={onPassword}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            <KeyRound className="h-4 w-4" /> Change password
          </button>
          {!isSelf && (
            <button
              type="button"
              onClick={onStatus}
              className="rounded-xl border border-amber-200 px-4 py-2.5 text-sm font-semibold text-amber-700"
            >
              {user.isActive ? "Deactivate" : "Activate"}
            </button>
          )}
          {!isSelf && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700"
            >
              Delete user
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 capitalize text-sm font-medium text-slate-800">
        {value}
      </dd>
    </div>
  );
}
