import { Eye, Pencil, Trash2, UserCheck, UserX } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import type { User } from "@/types/user";

// Keep hover titles working on disabled buttons (Button disables pointer events).
const disabledWithTitle =
  "disabled:pointer-events-auto disabled:cursor-not-allowed";

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
    <article className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900">{user.name}</p>
          <p className="mt-0.5 truncate text-sm text-slate-500">
            {user.userId}
          </p>
        </div>
        <Badge tone={user.isActive ? "success" : "danger"} dot>
          {user.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <span className="text-sm capitalize text-slate-600">{user.role}</span>
        <div className="flex gap-1.5">
          <ButtonLink
            href={`/users/${user._id}`}
            aria-label={`View ${user.name}`}
            variant="secondary"
            size="icon-sm"
          >
            <Eye />
          </ButtonLink>
          <Button
            onClick={() => onEdit(user)}
            aria-label={`Edit ${user.name}`}
            variant="secondary"
            size="icon-sm"
          >
            <Pencil />
          </Button>
          <Button
            onClick={() => onStatusChange(user)}
            disabled={isSelf}
            title={isSelf ? "You cannot change your own status" : undefined}
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
            onClick={() => onDelete(user)}
            disabled={isSelf}
            title={isSelf ? "You cannot delete your own account" : undefined}
            aria-label={`Delete ${user.name}`}
            variant="danger-soft"
            size="icon-sm"
            className={disabledWithTitle}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </article>
  );
}
