"use client";

import { use } from "react";
import { AlertTriangle } from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DeleteSectorButton from "@/components/sectors/DeleteSectorButton";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";

export default function DeleteSectorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <ProtectedRoute allowedRoles={["admin", "developer"]}>
      <PageContainer className="max-w-2xl">
        <PageHeader
          title="Delete Sector"
          description="This action cannot be undone. Please confirm before deleting this sector."
        />

        <Card>
          <CardContent>
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50/70 p-4">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-600" />

              <div>
                <h2 className="text-sm font-semibold text-red-800">
                  Are you sure you want to delete this sector?
                </h2>

                <p className="mt-1 text-sm text-red-700/90">
                  If this sector still has assigned locations, deletion will be
                  blocked by the backend.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <ButtonLink href="/sectors/view" variant="secondary">
                Cancel
              </ButtonLink>

              <DeleteSectorButton id={id} />
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </ProtectedRoute>
  );
}
