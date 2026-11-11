import { ArrowLeft, ShieldX } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-6 text-center sm:p-8">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-inset ring-red-100">
          <ShieldX className="size-6" />
        </div>

        <h1 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">
          403 Unauthorized
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          You do not have permission to access this page.
        </p>

        <ButtonLink href="/" variant="secondary" className="mt-6">
          <ArrowLeft />
          Back to Home
        </ButtonLink>
      </Card>
    </div>
  );
}
