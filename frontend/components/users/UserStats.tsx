import { Activity, ShieldCheck, UserX, Users } from "lucide-react";
import { StatCard, type StatTone } from "@/components/ui/StatCard";
import type { User } from "@/types/user";

export default function UserStats({ users }: { users: User[] }) {
  const stats: {
    label: string;
    value: number;
    icon: typeof Users;
    tone: StatTone;
  }[] = [
    {
      label: "Total users",
      value: users.length,
      icon: Users,
      tone: "blue",
    },
    {
      label: "Active users",
      value: users.filter((user) => user.isActive).length,
      icon: Activity,
      tone: "emerald",
    },
    {
      label: "Inactive users",
      value: users.filter((user) => !user.isActive).length,
      icon: UserX,
      tone: "red",
    },
    {
      label: "Administrators",
      value: users.filter((user) => user.role === "admin").length,
      icon: ShieldCheck,
      tone: "amber",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map(({ label, value, icon, tone }) => (
        <StatCard key={label} label={label} value={value} icon={icon} tone={tone} />
      ))}
    </div>
  );
}
