import { ClipboardList } from "lucide-react";

import PrimaryAction from "@/components/admin/cards/PrimaryAction";
import { primaryActions } from "@/components/admin/dashboard.config";
import SectionHeading from "@/components/admin/shared/SectionHeading";

export default function QuickActions() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <SectionHeading
        title="Quick Actions"
        description="Frequently used administration tasks"
        icon={ClipboardList}
        className="mb-4"
      />

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {primaryActions.map((item) => (
          <PrimaryAction key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}
