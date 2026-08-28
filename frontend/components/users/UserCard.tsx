import Link from "next/link";
import { Eye, Pencil, Trash2, UserCheck, UserX } from "lucide-react";
import type { User } from "@/types/user";

export default function UserCard({
  user,
  currentUserId,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  user: User;
  currentUserId?: string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onStatusChange: (user: User) => void;
}) {
  const isSelf = user._id === currentUserId;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-950">{user.name}</p>
          <p className="mt-1 text-sm text-slate-500">{user.userId}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <span className="text-sm capitalize text-slate-600">{user.role}</span>
        <div className="flex gap-2">
          <Link
            href={`/users/${user._id}`}
            aria-label={`View ${user.name}`}
            className="rounded-lg border p-2 text-slate-600"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => onEdit(user)}
            aria-label={`Edit ${user.name}`}
            className="rounded-lg border p-2 text-slate-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onStatusChange(user)}
            disabled={isSelf}
            title={isSelf ? "You cannot change your own status" : undefined}
            aria-label={
              user.isActive
                ? `Deactivate ${user.name}`
                : `Activate ${user.name}`
            }
            className="rounded-lg border p-2 text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {user.isActive ? (
              <UserX className="h-4 w-4" />
            ) : (
              <UserCheck className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onDelete(user)}
            disabled={isSelf}
            title={isSelf ? "You cannot delete your own account" : undefined}
            aria-label={`Delete ${user.name}`}
            className="rounded-lg border border-red-200 p-2 text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
