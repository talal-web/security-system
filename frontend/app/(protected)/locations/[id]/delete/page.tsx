"use client";

import { use } from "react";
import { AlertTriangle } from "lucide-react";

import DeleteLocationButton from "@/components/locations/DeleteLocationButton";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { Card, CardContent } from "@/components/ui/Card";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";

export default function DeleteLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <ProtectedRoute allowedRoles={["developer", "admin"]}>
      <PageContainer className="max-w-2xl">
        <PageHeader
          title="Delete Location"
          description="This action cannot be undone. Please confirm before deleting this location."
        />

        <Card>
          <CardContent>
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50/70 p-4">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-600" />

              <div>
                <h2 className="text-sm font-semibold text-red-800">
                  Are you sure you want to delete this location?
                </h2>

                <p className="mt-1 text-sm text-red-700/90">
                  Deleting this location may affect related records in the
                  system.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <DeleteLocationButton id={id} />
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </ProtectedRoute>
  );
}
