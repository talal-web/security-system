// app/employee/page.tsx

import Link from "next/link";

import {
  UserPlus,
  Users,
  PencilLine,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const actions = [
  {
    title: "Add Employee",
    description: "Register and manage new security employees professionally.",
    href: "/employees/create",
    icon: UserPlus,
    gradient: "from-emerald-500 to-green-600",
  },
  {
    title: "Update Employee",
    description: "Modify employee records, status, profiles, and information.",
    href: "/employees/update",
    icon: PencilLine,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "All Employees",
    description: "View complete employee records and detailed profiles.",
    href: "/employees/view",
    icon: Users,
    gradient: "from-blue-500 to-indigo-600",
  },
];

export default function EmployeePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,white,transparent_35%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Employee Management System
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Manage Employees
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Professionally
              </span>
            </h1>

            <p className="mt-6 text-base leading-7 text-slate-300 sm:text-lg">
              Securely manage employee records, updates, and profiles with a
              modern management dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="relative -mt-10 pb-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 sm:px-6 lg:px-8">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Background Glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                />

                {/* Icon */}
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${action.gradient} text-white shadow-lg`}
                >
                  <Icon className="h-8 w-8" />
                </div>

                {/* Content */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    {action.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {action.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    Open Module
                  </span>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 transition-all duration-300 group-hover:bg-slate-900">
                    <ArrowRight className="h-5 w-5 text-slate-700 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                </div>

                {/* Border Glow */}
                <div className="absolute inset-0 rounded-3xl border border-transparent transition-all duration-300 group-hover:border-slate-300" />
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
