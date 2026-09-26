import { Clock3 } from "lucide-react";

import CardHeading from "@/components/admin/shared/CardHeading";
import CompactLink from "@/components/admin/cards/CompactLink";
import StatusItem from "@/components/admin/cards/StatusItem";
import {
  attendanceLinks,
  payrollLinks,
  quickAdminLinks,
  systemStatus,
} from "@/components/admin/dashboard.config";

export default function DashboardSidebar() {
  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">System Status</h2>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Core platform services
            </p>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Clock3 className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          {systemStatus.map((label) => (
            <StatusItem key={label} label={label} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <CardHeading
          title="Attendance"
          description="Operations & reporting"
          icon={attendanceLinks[0].icon}
          tone="blue"
        />

        <div className="mt-3 space-y-1.5">
          {attendanceLinks.map((link) => (
            <CompactLink key={link.label} {...link} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <CardHeading
          title="Payroll & Finance"
          description="Salary-related operations"
          icon={payrollLinks[0].icon}
          tone="violet"
        />

        <div className="mt-3 space-y-1.5">
          {payrollLinks.map((link) => (
            <CompactLink key={link.label} {...link} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <CardHeading
          title="Quick Admin"
          description="Common creation actions"
          icon={quickAdminLinks[0].icon}
          tone="slate"
        />

        <div className="mt-3 space-y-1.5">
          {quickAdminLinks.map((link) => (
            <CompactLink key={link.label} {...link} />
          ))}
        </div>
      </div>
    </aside>
  );
}
