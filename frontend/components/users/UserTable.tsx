"use client";

import { Eye, Pencil, Trash2, UserCheck, UserX } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { User } from "@/types/user";

interface UserTableProps {
  users: User[];
  currentUserId?: string;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onStatusChange?: (user: User) => void;
}

// Keep hover titles working on disabled buttons (Button disables pointer events).
const disabledWithTitle =
  "disabled:pointer-events-auto disabled:cursor-not-allowed";

export default function UserTable({
  users,
  currentUserId,
  onEdit,
  onDelete,
  onStatusChange,
}: UserTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-medium text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">User ID</th>

              <th className="px-4 py-3 text-left font-medium">Name</th>

              <th className="px-4 py-3 text-left font-medium">Role</th>

              <th className="px-4 py-3 text-left font-medium">Status</th>

              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => {
              const isSelf = user._id === currentUserId;

              return (
                <tr
                  key={user._id}
                  className="transition-colors hover:bg-slate-50/60"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {user.userId}
                  </td>

                  <td className="px-4 py-3 text-slate-700">{user.name}</td>

                  <td className="px-4 py-3">
                    <Badge tone="info" className="capitalize">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onStatusChange?.(user)}
                      disabled={isSelf}
                      title={
                        isSelf ? "You cannot change your own status" : undefined
                      }
                      className="rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Badge tone={user.isActive ? "success" : "danger"} dot>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <ButtonLink
                        href={`/users/${user._id}`}
                        aria-label={`View ${user.name}`}
                        variant="secondary"
                        size="icon-sm"
                      >
                        <Eye />
                      </ButtonLink>
                      <Button
                        onClick={() => onEdit?.(user)}
                        aria-label={`Edit ${user.name}`}
                        variant="secondary"
                        size="icon-sm"
                      >
                        <Pencil />
                      </Button>

                      <Button
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
                        variant="secondary"
                        size="icon-sm"
                        className={disabledWithTitle}
                      >
                        {user.isActive ? <UserX /> : <UserCheck />}
                      </Button>

                      <Button
                        onClick={() => onDelete?.(user)}
                        disabled={isSelf}
                        title={
                          isSelf
                            ? "You cannot delete your own account"
                            : undefined
                        }
                        aria-label={`Delete ${user.name}`}
                        variant="danger-soft"
                        size="icon-sm"
                        className={disabledWithTitle}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-sm text-slate-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
