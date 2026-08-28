"use client";

import CreateLocationForm from "@/components/locations/CreateLocationForm";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

export default function CreateLocationPage() {
  return (
    <ProtectedRoute allowedRoles={["developer", "admin", "clerk"]}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CreateLocationForm />
      </div>
    </ProtectedRoute>
  );
}
