"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UserCard from "@/components/users/UserCard";
import UserFilters from "@/components/users/UserFilters";
import UserHeader from "@/components/users/UserHeader";
import UserStats from "@/components/users/UserStats";
import UserTable from "@/components/users/UserTable";
import DeleteUserDialog from "@/components/users/DeleteUserDialog";
import ChangeStatusDialog from "@/components/users/ChangeStatusDialog";
import {
  useDeleteUser,
  useUpdateUserStatus,
  useUsers,
} from "@/hooks/users/useUsers";
import { getApiErrorMessage } from "@/lib/apiError";
import type { User, UserRole } from "@/types/user";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { useMe } from "@/hooks/auth/useMe";

const emptyUsers: User[] = [];

export default function UsersPage() {
  const router = useRouter();
  const { data: me } = useMe();
  const { data, isLoading, isError, error } = useUsers();
  const deleteUser = useDeleteUser();
  const updateUserStatus = useUpdateUserStatus();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "all">("all");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [selected, setSelected] = useState<User | null>(null);
  const [dialog, setDialog] = useState<"delete" | "status" | null>(null);
  const users = data?.users ?? emptyUsers;
  const filtered = useMemo(
    () =>
      users.filter(
        (user) =>
          (!search ||
            `${user.name} ${user.userId}`
              .toLowerCase()
              .includes(search.toLowerCase())) &&
          (role === "all" || user.role === role) &&
          (status === "all" ||
            (status === "active" ? user.isActive : !user.isActive)),
      ),
    [users, search, role, status],
  );
  const close = () => {
    setDialog(null);
    setSelected(null);
  };
  const confirm = () => {
    if (!selected) return;
    if (dialog === "delete")
      deleteUser.mutate(selected._id, {
        onSuccess: () => {
          toast.success("User deleted successfully.");
          close();
        },
        onError: (err) =>
          toast.error(getApiErrorMessage(err) || "Failed to delete user."),
      });
    if (dialog === "status")
      updateUserStatus.mutate(
        { id: selected._id, payload: { isActive: !selected.isActive } },
        {
          onSuccess: () => {
            toast.success("User status updated.");
            close();
          },
          onError: (err) =>
            toast.error(getApiErrorMessage(err) || "Failed to update status."),
        },
      );
  };

  if (isLoading) {
    return (
      <main className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-40 rounded bg-gray-200" />
          <div className="h-64 rounded-xl bg-gray-100" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error instanceof Error ? error.message : "Failed to load users."}
        </div>
      </main>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["developer", "admin"]}>
      <main className="space-y-6 bg-slate-50 p-4 sm:p-6">
        <UserHeader />
        <UserStats users={users} />
        <UserFilters
          search={search}
          role={role}
          status={status}
          onSearch={setSearch}
          onRole={setRole}
          onStatus={setStatus}
        />
        <div className="hidden md:block">
          <UserTable
            users={filtered}
            currentUserId={me?.user?.id}
            onEdit={(user) => router.push(`/users/${user._id}/edit`)}
            onDelete={(user) => {
              setSelected(user);
              setDialog("delete");
            }}
            onStatusChange={(user) => {
              setSelected(user);
              setDialog("status");
            }}
          />
        </div>
        <div className="grid gap-3 md:hidden">
          {filtered.length ? (
            filtered.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                currentUserId={me?.user?.id}
                onEdit={(item) => router.push(`/users/${item._id}/edit`)}
                onDelete={(item) => {
                  setSelected(item);
                  setDialog("delete");
                }}
                onStatusChange={(item) => {
                  setSelected(item);
                  setDialog("status");
                }}
              />
            ))
          ) : (
            <p className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500">
              No users match your filters.
            </p>
          )}
        </div>
        {selected && (
          <>
            <DeleteUserDialog
              user={selected}
              open={dialog === "delete"}
              isPending={deleteUser.isPending}
              onClose={close}
              onConfirm={confirm}
            />
            <ChangeStatusDialog
              user={selected}
              open={dialog === "status"}
              isPending={updateUserStatus.isPending}
              onClose={close}
              onConfirm={confirm}
            />
          </>
        )}
      </main>
    </ProtectedRoute>
  );
}
