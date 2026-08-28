"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2, UserCheck, UserX } from "lucide-react";

import type { User } from "@/types/user";

interface UserTableProps {
  users: User[];
  currentUserId?: string;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onStatusChange?: (user: User) => void;
}

export default function UserTable({
  users,
  currentUserId,
  onEdit,
  onDelete,
  onStatusChange,
}: UserTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">User ID</th>

              <th className="px-4 py-3 text-left font-semibold">Name</th>

              <th className="px-4 py-3 text-left font-semibold">Role</th>

              <th className="px-4 py-3 text-left font-semibold">Status</th>

              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.map((user) => {
              const isSelf = user._id === currentUserId;

              return (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{user.userId}</td>

                  <td className="px-4 py-3">{user.name}</td>

                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium capitalize text-blue-700">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onStatusChange?.(user)}
                      disabled={isSelf}
                      title={
                        isSelf ? "You cannot change your own status" : undefined
                      }
                      className={`rounded-full px-2.5 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-60 ${
                        user.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/users/${user._id}`}
                        aria-label={`View ${user.name}`}
                        className="rounded-lg border p-2 text-slate-600 hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onEdit?.(user)}
                        aria-label={`Edit ${user.name}`}
                        className="rounded-lg border p-2 text-slate-600 hover:bg-gray-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onStatusChange?.(user)}
                        disabled={isSelf}
                        title={
                          isSelf
                            ? "You cannot change your own status"
                            : undefined
                        }
                        aria-label={
                          user.isActive
                            ? `Deactivate ${user.name}`
                            : `Activate ${user.name}`
                        }
                        className="rounded-lg border p-2 text-slate-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {user.isActive ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete?.(user)}
                        disabled={isSelf}
                        title={
                          isSelf
                            ? "You cannot delete your own account"
                            : undefined
                        }
                        aria-label={`Delete ${user.name}`}
                        className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
