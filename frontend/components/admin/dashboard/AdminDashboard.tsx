import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import QuickActions from "@/components/admin/dashboard/QuickActions";
import OrganizationManagement from "@/components/admin/dashboard/OrganizationManagement";
import FinanceManagement from "@/components/admin/dashboard/FinanceManagement";
import DashboardSidebar from "@/components/admin/dashboard/DashboardSidebar";
import {
  AttendanceTodayCard,
  DashboardKpis,
  PayrollStatusCard,
  RecentPayrollActivity,
} from "@/components/admin/dashboard/DashboardInsights";
import { PageContainer } from "@/components/ui/PageHeader";

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
    <PageContainer>
      <DashboardHeader
        userName={userName}
        isLoading={isLoading}
        isError={isError}
      />

      <DashboardKpis />

      <div className="grid gap-4 lg:grid-cols-2">
        <AttendanceTodayCard />
        <PayrollStatusCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          <QuickActions />
          <RecentPayrollActivity />
          <OrganizationManagement />
          <FinanceManagement />
        </div>

        <DashboardSidebar />
      </div>
    </PageContainer>
  );
}
