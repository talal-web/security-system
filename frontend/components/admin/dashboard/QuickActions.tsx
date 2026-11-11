import { Zap } from "lucide-react";

import PrimaryAction from "@/components/admin/cards/PrimaryAction";
import { primaryActions } from "@/components/admin/dashboard.config";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function QuickActions() {
  return (
    <Card>
      <CardHeader
        title="Quick actions"
        description="Frequently used administration tasks"
        icon={Zap}
      />
      <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {primaryActions.map((item) => (
          <PrimaryAction key={item.title} item={item} />
        ))}
      </CardContent>
    </Card>
  );
}
