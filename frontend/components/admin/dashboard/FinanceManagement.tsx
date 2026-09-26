import { WalletCards } from "lucide-react";

import FinanceCard from "@/components/admin/cards/FinanceCard";
import { financeModules } from "@/components/admin/dashboard.config";
import SectionHeading from "@/components/admin/shared/SectionHeading";

export default function FinanceManagement() {
  return (
    <section>
      <SectionHeading
        title="Payroll & Finance"
        description="Manage employee financial transactions and salary adjustments"
        icon={WalletCards}
      />

      <div className="mt-2 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {financeModules.map((module) => (
          <FinanceCard key={module.title} module={module} />
        ))}
      </div>
    </section>
  );
}
