// app/dashboard/layout.tsx

"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useMe } from "@/hooks/auth/useMe";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { data, isLoading, isError } = useMe();

  console.log("ME:", data);

  useEffect(() => {
    if (isError) {
      router.push("/login");
    }
  }, [isError, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <p className="text-sm text-gray-500">Welcome {data?.user?.name}</p>
          </div>

          <div className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">
            {data?.user?.role}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4">{children}</main>
    </div>
  );
}
