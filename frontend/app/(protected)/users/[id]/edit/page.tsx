"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import UserForm from "@/components/users/UserForm";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { useUpdateUser, useUser } from "@/hooks/users/useUsers";
import { useMe } from "@/hooks/auth/useMe";
import { getApiErrorMessage } from "@/lib/apiError";
import type { UpdateUserPayload } from "@/types/user";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: me } = useMe();
  const query = useUser(id);
  const mutation = useUpdateUser();

  const isSelf = me?.user?.id === id;

  if (query.isLoading || !me) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-600">Loading user...</p>
      </main>
    );
  }

  if (query.isError || !query.data?.user) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white p-6">
          <h1 className="text-lg font-semibold text-red-700">
            Unable to load user
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {query.error instanceof Error
              ? query.error.message
              : "User not found."}
          </p>
        </div>
      </main>
    );
  }

  const handleSubmit = (payload: UpdateUserPayload) => {
    mutation.mutate(
      {
        id,
        payload,
      },
      {
        onSuccess: () => {
          toast.success("User updated successfully.");
          router.push(`/users/${id}`);
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error) || "Failed to update user.");
        },
      },
    );
  };

  return (
    <ProtectedRoute allowedRoles={["developer", "admin"]}>
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Edit User
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {isSelf
                ? "Update your profile name. Your role and account status cannot be changed."
                : "Update this user's profile, role, and account status."}
            </p>
          </div>

          {isSelf && (
            <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
              <p className="text-sm font-medium text-blue-800">
                You are editing your own account.
              </p>

              <p className="mt-1 text-xs text-blue-600">
                Your role and account status are protected and cannot be changed
                from your own account.
              </p>
            </div>
          )}

          <UserForm
            user={query.data.user}
            isSelf={isSelf}
            isPending={mutation.isPending}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </ProtectedRoute>
  );
}
