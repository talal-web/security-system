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
    if (!isLoading && role !== "admin") {
      router.push("/dashboard"); // or /unauthorized
    }
  }, [isLoading, role, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading admin panel...
      </div>
    );
  }

  return <>{children}</>;
}
