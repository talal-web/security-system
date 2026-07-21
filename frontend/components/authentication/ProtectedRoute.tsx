"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMe } from "@/hooks/auth/useMe";

type Role = "admin" | "supervisor" | "developer";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();

  const { data, isLoading, isError } = useMe();

  const user = data?.user;
  const role = user?.role as Role | undefined;

  useEffect(() => {
    if (isLoading) return;

    if (isError || !user) {
      router.replace("/?login=true");
      return;
    }

    if (!allowedRoles.includes(role!)) {
      router.replace("/dashboard/unauthorized");
    }
  }, [isLoading, isError, user, role, allowedRoles, router]);

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
