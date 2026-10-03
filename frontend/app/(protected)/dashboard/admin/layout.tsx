"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useMe } from "@/hooks/auth/useMe";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading } = useMe();
  const role = data?.user?.role;

  const query = searchParams.toString();
  const unauthorizedUrl = query
    ? `/dashboard/unauthorized?${query}`
    : "/dashboard/unauthorized";

  useEffect(() => {
    if (!isLoading && role !== "admin" && role !== "developer") {
      router.replace(unauthorizedUrl);
    }
  }, [isLoading, role, router, unauthorizedUrl]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm font-medium text-slate-600">
          Loading admin panel...
        </p>
      </div>
    );
  }

  if (role !== "admin" && role !== "developer") {
    return null;
  }

  return <>{children}</>;
}
