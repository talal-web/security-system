// components/dashboard/supervisor/QuickActionCard.tsx
"use client";

import Link from "next/link";

type QuickActionCardProps = {
  title: string;
  href: string;
};

export default function QuickActionCard({ title, href }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800"
    >
      {title}
    </Link>
  );
}
