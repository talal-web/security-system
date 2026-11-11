"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert, UserX } from "lucide-react";

import { useMe } from "@/hooks/auth/useMe";
import { ApiError } from "@/lib/apiError";
import AppShell from "@/components/shell/AppShell";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

function StatusScreen({
  icon: Icon,
  title,
  description,
  detail,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  detail?: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 text-center shadow-card">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <Icon className="size-5" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
        {detail && (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {detail}
          </p>
        )}
      </div>
    </div>
  );
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
      <div
        role="status"
        className="flex min-h-screen flex-col items-center justify-center gap-3 bg-canvas text-sm text-slate-500"
      >
        <Loader2 className="size-6 animate-spin text-blue-600" />
        Authenticating...
      </div>
    );
  }

  if (isInactive) {
    return (
      <StatusScreen
        icon={UserX}
        title="Account Inactive"
        description="Redirecting you to the unauthorized page."
      />
    );
  }

  if (isError || !data?.user) {
    return (
      <StatusScreen
        icon={ShieldAlert}
        title="Session Verification Failed"
        description="Redirecting to login so you can authenticate again."
        detail={
          isError
            ? error instanceof Error
              ? error.message
              : "Unable to verify your session."
            : undefined
        }
      />
    );
  }

  return <AppShell>{children}</AppShell>;
}
