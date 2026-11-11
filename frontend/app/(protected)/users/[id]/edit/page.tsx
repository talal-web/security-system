"use client";

import { useParams, useRouter } from "next/navigation";
import { Info, UserPen } from "lucide-react";
import { toast } from "sonner";

import UserForm from "@/components/users/UserForm";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { ErrorState, LoadingState } from "@/components/ui/States";
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
      <PageContainer className="max-w-2xl">
        <LoadingState title="Loading user..." />
      </PageContainer>
    );
  }

  if (query.isError || !query.data?.user) {
    return (
      <PageContainer className="max-w-2xl">
        <ErrorState
          title="Unable to load user"
          description={
            query.error instanceof Error
              ? query.error.message
              : "User not found."
          }
        />
      </PageContainer>
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
      <PageContainer className="max-w-2xl">
        <PageHeader
          title="Edit User"
          icon={UserPen}
          description={
            isSelf
              ? "Update your profile name. Your role and account status cannot be changed."
              : "Update this user's profile, role, and account status."
          }
        />

        {isSelf && (
          <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-3">
            <Info className="mt-0.5 size-4 shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                You are editing your own account.
              </p>

              <p className="mt-0.5 text-sm text-blue-700/90">
                Your role and account status are protected and cannot be changed
                from your own account.
              </p>
            </div>
          </div>
        )}

        <UserForm
          user={query.data.user}
          isSelf={isSelf}
          isPending={mutation.isPending}
          onSubmit={handleSubmit}
        />
      </PageContainer>
    </ProtectedRoute>
  );
}
