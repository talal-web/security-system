"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useMe } from "@/hooks/auth/useMe";

type Role = "admin" | "supervisor" | "developer";

type ProtectedRouteProps = {
  children: React.ReactNode;

  allowedRoles: Role[];
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();

  const { data, isLoading, isError } = useMe();

  const user = data?.user;

  const role = user?.role as Role | undefined;

  // 🔐 Not authenticated
  useEffect(() => {
    if (isError) {
      router.replace("/login");
    }
  }, [isError, router]);

  // 🚫 Unauthorized role
  useEffect(() => {
    if (!isLoading && role) {
      const hasAccess = allowedRoles.includes(role);

      if (!hasAccess) {
        router.replace("app/dashboard/unauthorized");
      }
    }
  }, [isLoading, role, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium">Checking permissions...</p>
      </div>
    );
  }

  return <>{children}</>;
}
