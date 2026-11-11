"use client";

import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import UserForm from "@/components/users/UserForm";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { useCreateUser } from "@/hooks/users/useUsers";
import { getApiErrorMessage } from "@/lib/apiError";
import type { CreateUserPayload } from "@/types/user";

export default function CreateUserPage() {
  const router = useRouter();
  const mutation = useCreateUser();
  return (
    <ProtectedRoute allowedRoles={["developer", "admin"]}>
      <PageContainer className="max-w-2xl">
        <PageHeader
          title="Create user"
          icon={UserPlus}
          description="Set up a new account and its initial access role."
        />
        <UserForm
          isPending={mutation.isPending}
          onSubmit={(payload) =>
            mutation.mutate(payload as CreateUserPayload, {
              onSuccess: () => {
                toast.success("User created successfully.");
                router.push("/users");
              },
              onError: (error) =>
                toast.error(
                  getApiErrorMessage(error) || "Failed to create user.",
                ),
            })
          }
        />
      </PageContainer>
    </ProtectedRoute>
  );
}
