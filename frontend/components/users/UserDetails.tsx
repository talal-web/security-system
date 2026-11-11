import Link from "next/link";
import { ArrowLeft, KeyRound, Pencil, Shield } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAreas } from "@/hooks/area/useArea";
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
  const { data: areas = [] } = useAreas({ isActive: true });
  const assignedAreaNames = (user.areas ?? []).map((areaId) => {
    const area = areas.find((item) => item._id === areaId);
    return area?.name ?? areaId;
  });

  return (
    <div className="space-y-6">
      <Link
        href="/users"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="size-4" /> Back to users
      </Link>
      <Card>
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg font-semibold text-blue-700 ring-1 ring-inset ring-blue-100">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                {user.name}
              </h1>
              <p className="truncate text-sm text-slate-500">{user.userId}</p>
            </div>
          </div>
          <Badge
            tone={user.isActive ? "success" : "danger"}
            dot
            className="w-fit"
          >
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <dl className="grid gap-5 border-t border-slate-100 p-4 sm:grid-cols-2 sm:p-6">
          <Info label="Role" value={user.role} />
          <Info
            label="Areas"
            value={
              assignedAreaNames.length
                ? assignedAreaNames.join(", ")
                : "No area assigned"
            }
          />
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
        <div className="flex flex-wrap gap-2 rounded-b-xl border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-6">
          <ButtonLink href={`/users/${user._id}/edit`}>
            <Pencil /> Edit profile
          </ButtonLink>
          <Button
            variant="secondary"
            onClick={onRole}
            disabled={isSelf}
            title={isSelf ? "You cannot change your own role" : undefined}
            className="disabled:pointer-events-auto disabled:cursor-not-allowed"
          >
            <Shield /> Change role
          </Button>
          <Button variant="secondary" onClick={onPassword}>
            <KeyRound /> Change password
          </Button>
          {!isSelf && (
            <Button
              variant="secondary"
              onClick={onStatus}
              className="border-amber-200 text-amber-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
            >
              {user.isActive ? "Deactivate" : "Activate"}
            </Button>
          )}
          {!isSelf && (
            <Button variant="danger-soft" onClick={onDelete}>
              Delete user
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium capitalize text-slate-900">
        {value}
      </dd>
    </div>
  );
}
