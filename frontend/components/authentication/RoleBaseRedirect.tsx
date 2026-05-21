"use client";

import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useMe } from "@/hooks/auth/useMe";

type Role = "admin" | "supervisor" | "developer";

type Props = {
  children: React.ReactNode;
};

export default function RoleBasedRedirect({ children }: Props) {
  const router = useRouter();

  const pathname = usePathname();

  const { data, isLoading, isError } = useMe();

  const user = data?.user;

  const role = user?.role as Role | undefined;
  function getRoleDashboard(role: Role) {
    switch (role) {
      case "admin":
        return "/dashboard/admin";

      case "supervisor":
        return "/dashboard/supervisor";

      case "developer":
        return "/dashboard/developer";

      default:
        return "/unauthorized";
    }
  }

  // 🔐 Redirect unauthenticated users
  useEffect(() => {
    if (isError) {
      router.replace("/login");
    }
  }, [isError, router]);

  // 🚀 Role-based redirect
  useEffect(() => {
    if (!isLoading && role) {
      const roleDashboard = getRoleDashboard(role);

      // only redirect when user is exactly on /dashboard
      if (pathname === "/dashboard") {
        router.replace(roleDashboard);
      }
    }
  }, [isLoading, role, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return <>{children}</>;
}
