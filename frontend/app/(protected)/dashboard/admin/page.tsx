"use client";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import AdminDashboard from "@/components/admin/dashboard/AdminDashboard";
import { useMe } from "@/hooks/auth/useMe";

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useMe();

  const userName = data?.user?.name || "Admin";

  return (
    <ProtectedRoute allowedRoles={["admin", "developer"]}>
      <AdminDashboard
        userName={userName}
        isLoading={isLoading}
        isError={isError}
      />
    </ProtectedRoute>
  );
}
