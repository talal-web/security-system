// app/dashboard/developer/page.tsx

"use client";

import DeveloperHeader from "@/components/dashboard/developer/DeveloperHeader";
import DeveloperStats from "@/components/dashboard/developer/DeveloperStats";
import DeveloperQuickActions from "@/components/dashboard/developer/DeveloperQuickActions";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

export default function DeveloperDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <ProtectedRoute allowedRoles={["developer"]}>
        <DeveloperHeader />

        <DeveloperStats />

        <DeveloperQuickActions />
      </ProtectedRoute>
    </main>
  );
}
