import { Activity, ShieldCheck, UserX, Users } from "lucide-react";
import type { User } from "@/types/user";

export default function UserStats({ users }: { users: User[] }) {
  const stats = [
    {
      label: "Total users",
      value: users.length,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active users",
      value: users.filter((user) => user.isActive).length,
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Inactive users",
      value: users.filter((user) => !user.isActive).length,
      icon: UserX,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Administrators",
      value: users.filter((user) => user.role === "admin").length,
      icon: ShieldCheck,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div
          key={label}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div
            className={`mb-4 flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}
          >
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
        </div>
      ))}
    </div>
  );
}
