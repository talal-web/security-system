"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import UserDetails from "@/components/users/UserDetails";
import ChangeRoleDialog from "@/components/users/ChangeRoleDialog";
import ChangePasswordDialog from "@/components/users/ChangePasswordDialog";
import ChangeStatusDialog from "@/components/users/ChangeStatusDialog";
import DeleteUserDialog from "@/components/users/DeleteUserDialog";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { useMe } from "@/hooks/auth/useMe";
import {
  useChangeUserPassword,
  useDeleteUser,
  useUpdateUser,
  useUpdateUserStatus,
  useUser,
} from "@/hooks/users/useUsers";
import { getApiErrorMessage } from "@/lib/apiError";
import type { UserRole } from "@/types/user";

type Dialog = "role" | "password" | "status" | "delete" | null;

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: me } = useMe();
  const query = useUser(id);
  const roleMutation = useUpdateUser();
  const passwordMutation = useChangeUserPassword();
  const statusMutation = useUpdateUserStatus();
  const deleteMutation = useDeleteUser();
  const [dialog, setDialog] = useState<Dialog>(null);
  const user = query.data?.user;
  const close = () => setDialog(null);
  const options = (success: string, failure: string, after?: () => void) => ({
    onSuccess: () => {
      toast.success(success);
      close();
      after?.();
    },
    onError: (error: unknown) =>
      toast.error(getApiErrorMessage(error) || failure),
  });
  if (query.isLoading) return <main className="p-6">Loading user...</main>;
  if (query.isError || !user)
    return (
      <main className="p-6 text-red-600">
        {query.error instanceof Error ? query.error.message : "User not found."}
      </main>
    );
  return (
    <ProtectedRoute allowedRoles={["developer", "admin"]}>
      <main className="min-h-full bg-slate-50 p-4 sm:p-6">
        <UserDetails
          user={user}
          isSelf={me?.user?.id === user._id}
          onRole={() => setDialog("role")}
          onPassword={() => setDialog("password")}
          onStatus={() => setDialog("status")}
          onDelete={() => setDialog("delete")}
        />
        <ChangeRoleDialog
          user={user}
          open={dialog === "role"}
          isPending={roleMutation.isPending}
          onClose={close}
          onSubmit={(role: UserRole) =>
            roleMutation.mutate(
              { id, payload: { role } },
              options("Role updated successfully.", "Failed to update role."),
            )
          }
        />
        <ChangePasswordDialog
          open={dialog === "password"}
          isPending={passwordMutation.isPending}
          onClose={close}
          onSubmit={(password) =>
            passwordMutation.mutate(
              { id, payload: { password } },
              options(
                "Password updated successfully.",
                "Failed to update password.",
              ),
            )
          }
        />
        <ChangeStatusDialog
          user={user}
          open={dialog === "status"}
          isPending={statusMutation.isPending}
          onClose={close}
          onConfirm={() =>
            statusMutation.mutate(
              { id, payload: { isActive: !user.isActive } },
              options(
                "Status updated successfully.",
                "Failed to update status.",
              ),
            )
          }
        />
        <DeleteUserDialog
          user={user}
          open={dialog === "delete"}
          isPending={deleteMutation.isPending}
          onClose={close}
          onConfirm={() =>
            deleteMutation.mutate(
              id,
              options(
                "User deleted successfully.",
                "Failed to delete user.",
                () => router.push("/users"),
              ),
            )
          }
        />
      </main>
    </ProtectedRoute>
  );
}
