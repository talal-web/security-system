"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMe } from "@/hooks/auth/useMe";
import { ApiError } from "@/lib/apiError";
import type { UserRole } from "@/types/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();

  const { data, isLoading, isError, error } = useMe();

  const user = data?.user;
  const role = user?.role as UserRole | undefined;
  const isInactive = error instanceof ApiError && error.status === 403;

  useEffect(() => {
    if (isLoading) return;

    if (isInactive) {
      router.replace("/dashboard/unauthorized");
      return;
    }

    if (isError || !user) {
      router.replace("/?login=true");
      return;
    }

    if (!allowedRoles.includes(role!)) {
      router.replace("/dashboard/unauthorized");
    }
  }, [isLoading, isInactive, isError, user, role, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium">Checking permissions...</p>
      </div>
    );
  }

  if (isError || !user || !allowedRoles.includes(role!)) {
    return null;
  }

  return <>{children}</>;
}
