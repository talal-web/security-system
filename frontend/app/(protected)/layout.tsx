"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMe } from "@/hooks/auth/useMe";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();

  const { data, isLoading, isError } = useMe();

  useEffect(() => {
    if (isLoading) return;

    if (isError || !data?.user) {
      router.replace("/login");
    }
  }, [isLoading, isError, data, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium text-slate-600">Authenticating...</p>
      </div>
    );
  }

  if (isError || !data?.user) {
    return null;
  }

  return <>{children}</>;
}
