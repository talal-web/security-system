import React from "react";

interface EmployeeSectionProps {
  title: string;
  color?: string;
  children: React.ReactNode;
}

export default function EmployeeSection({
  title,
  color = "bg-slate-900",
  children,
}: EmployeeSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className={`h-8 w-1 rounded-full ${color}`} />

        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{title}</h2>
      </div>

      {children}
    </section>
  );
}
