// app/login/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import LoginForm from "@/components/authentication/LoginForm";
import { useMe } from "@/hooks/auth/useMe";

export default function LoginPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useMe();

  useEffect(() => {
    if (!isLoading && !isError && data?.user) {
      router.replace("/dashboard");
    }
  }, [data, isLoading, isError, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-lg font-medium">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
