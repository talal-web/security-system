// components/dashboard/SectionCard.tsx
"use client";

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

export default function SectionCard({
  title,
  children,
  action,
}: SectionCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

        {action}
      </div>

      {children}
    </div>
  );
}
