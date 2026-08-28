"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/auth/useMe";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data, isLoading } = useMe();

  const role = data?.user?.role;

  useEffect(() => {
    if (!isLoading && role !== "admin" && role !== "developer") {
      router.replace("/dashboard/unauthorized");
    }
  }, [isLoading, role, router]);

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
