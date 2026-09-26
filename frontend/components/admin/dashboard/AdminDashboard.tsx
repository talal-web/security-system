import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import QuickOverview from "@/components/admin/dashboard/QuickOverview";
import QuickActions from "@/components/admin/dashboard/QuickActions";
import OrganizationManagement from "@/components/admin/dashboard/OrganizationManagement";
import FinanceManagement from "@/components/admin/dashboard/FinanceManagement";
import DashboardSidebar from "@/components/admin/dashboard/DashboardSidebar";

type AdminDashboardProps = {
  userName: string;
  isLoading: boolean;
  isError: boolean;
};

export default function AdminDashboard({
  userName,
  isLoading,
  isError,
}: AdminDashboardProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-5 p-3 sm:p-5 lg:p-6">
        <DashboardHeader
          userName={userName}
          isLoading={isLoading}
          isError={isError}
        />

        <QuickOverview />

        <QuickActions />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            <OrganizationManagement />
            <FinanceManagement />
          </div>

          <DashboardSidebar />
        </div>
      </div>
    </main>
  );
}
