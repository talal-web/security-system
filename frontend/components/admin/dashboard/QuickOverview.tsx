import { overviewItems } from "@/components/admin/dashboard.config";
import OverviewCard from "@/components/admin/cards/OverviewCard";
import SectionHeading from "@/components/admin/shared/SectionHeading";

import { Landmark } from "lucide-react";

export default function QuickOverview() {
  return (
    <section>
      <SectionHeading
        title="Quick Overview"
        description="Jump directly to the main operational areas"
        icon={Landmark}
      />

      <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
        {overviewItems.map((item) => (
          <OverviewCard key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}
