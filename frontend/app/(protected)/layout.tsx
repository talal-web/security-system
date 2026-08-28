"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMe } from "@/hooks/auth/useMe";
import { ApiError } from "@/lib/apiError";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();

  const { data, isLoading, isError, error } = useMe();
  const isInactive = error instanceof ApiError && error.status === 403;

  useEffect(() => {
    if (isLoading) return;

    if (isInactive) {
      router.replace("/dashboard/unauthorized");
      return;
    }

    if (isError || !data?.user) {
      router.replace("/?login=true");
    }
  }, [isLoading, isInactive, isError, data, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium text-slate-600">Authenticating...</p>
      </div>
    );
  }

  if (isInactive) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Account Inactive
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Redirecting you to the unauthorized page.
          </p>
        </div>
      </div>
    );
  }

  if (isError || !data?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Session Verification Failed
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Redirecting to login so you can authenticate again.
          </p>

          {isError && (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error instanceof Error
                ? error.message
                : "Unable to verify your session."}
            </p>
          )}
        </div>
      </div>
    );
  }

  return children;
}
