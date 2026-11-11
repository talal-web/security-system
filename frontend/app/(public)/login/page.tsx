// app/login/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import LoginForm from "@/components/authentication/LoginForm";
import { useMe } from "@/hooks/auth/useMe";
import { Card } from "@/components/ui/Card";
import { FullPageLoader } from "@/components/ui/States";

export default function LoginPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useMe();

  useEffect(() => {
    if (!isLoading && !isError && data?.user) {
      router.replace("/dashboard");
    }
  }, [data, isLoading, isError, router]);

  if (isLoading) {
    return <FullPageLoader label="Checking authentication..." />;
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm p-6 sm:p-8">
        <LoginForm />
      </Card>
    </div>
  );
}
