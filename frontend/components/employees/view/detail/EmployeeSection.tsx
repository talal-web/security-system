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
    <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className={`h-5 w-1 rounded-full ${color}`} />

        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>

      {children}
    </section>
  );
}
