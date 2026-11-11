"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useMe } from "@/hooks/auth/useMe";
import { ApiError } from "@/lib/apiError";
import type { UserRole } from "@/types/user";
import { FullPageLoader } from "@/components/ui/States";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading, isError, error } = useMe();

  const user = data?.user;
  const role = user?.role as UserRole | undefined;
  const isInactive = error instanceof ApiError && error.status === 403;

  const query = searchParams.toString();
  const areaQuery = searchParams.get("area");
  const querySuffix = query ? `?${query}` : "";

  const unauthorizedUrl = `/dashboard/unauthorized${querySuffix}`;
  const loginUrl = `/?login=true${
    areaQuery ? `&area=${encodeURIComponent(areaQuery)}` : ""
  }`;

  useEffect(() => {
    if (isLoading) return;

    if (isInactive) {
      router.replace(unauthorizedUrl);
      return;
    }

    if (isError || !user) {
      router.replace(loginUrl);
      return;
    }

    if (!allowedRoles.includes(role!)) {
      router.replace(unauthorizedUrl);
    }
  }, [
    isLoading,
    isInactive,
    isError,
    user,
    role,
    allowedRoles,
    router,
    unauthorizedUrl,
    loginUrl,
  ]);

  if (isLoading) {
    return <FullPageLoader label="Checking permissions..." />;
  }

  if (isError || !user || !allowedRoles.includes(role!)) {
    return null;
  }

  return <>{children}</>;
}
