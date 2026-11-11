"use client";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { User, UserRole } from "@/types/user";

const ASSIGNABLE_ROLES: UserRole[] = ["admin", "clerk", "supervisor"];

export default function ChangeRoleDialog({
  user,
  open,
  isPending,
  onClose,
  onSubmit,
}: {
  user: User;
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (role: UserRole) => void;
}) {
  const isDeveloper = user.role === "developer";

  return (
    <Modal open={open} onClose={onClose} title="Change role">
      <form
        onSubmit={(event) => {
          event.preventDefault();

          if (isDeveloper) return;

          onSubmit(
            (
              event.currentTarget.elements.namedItem(
                "role",
              ) as HTMLSelectElement
            ).value as UserRole,
          );
        }}
        className="space-y-5"
      >
        <p className="text-sm text-slate-600">
          Update the access role for <strong>{user.name}</strong>.
        </p>
        <select
          name="role"
          defaultValue={user.role}
          disabled={isDeveloper}
          className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
        >
          {isDeveloper && <option value="developer">Developer</option>}
          {ASSIGNABLE_ROLES.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
        {isDeveloper && (
          <p className="text-xs text-slate-500">
            Developer role cannot be changed.
          </p>
        )}
        <Button
          type="submit"
          disabled={isPending || isDeveloper}
          className="w-full"
        >
          {isPending ? "Updating..." : "Update role"}
        </Button>
      </form>
    </Modal>
  );
}
