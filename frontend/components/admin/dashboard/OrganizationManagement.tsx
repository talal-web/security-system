import { Building2 } from "lucide-react";

import ModuleCard from "@/components/admin/cards/ModuleCard";
import { managementModules } from "@/components/admin/dashboard.config";
import SectionHeading from "@/components/admin/shared/SectionHeading";

export default function OrganizationManagement() {
  return (
    <section>
      <SectionHeading
        title="Organization Management"
        description="Manage the people and operational structure of the company"
        icon={Building2}
      />

      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {managementModules.map((module) => (
          <ModuleCard key={module.title} module={module} />
        ))}
      </div>
    </section>
  );
}
