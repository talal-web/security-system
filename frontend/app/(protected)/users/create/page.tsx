"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UserForm from "@/components/users/UserForm";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { useCreateUser } from "@/hooks/users/useUsers";
import { getApiErrorMessage } from "@/lib/apiError";
import type { CreateUserPayload } from "@/types/user";

export default function CreateUserPage() {
  const router = useRouter();
  const mutation = useCreateUser();
  return (
    <ProtectedRoute allowedRoles={["developer", "admin"]}>
      <main className="min-h-full bg-slate-50 p-4 sm:p-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-1 text-2xl font-bold text-slate-950">
            Create user
          </h1>
          <p className="mb-6 text-sm text-slate-500">
            Set up a new account and its initial access role.
          </p>
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
        </div>
      </main>
    </ProtectedRoute>
  );
}
