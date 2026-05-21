// components/dashboard/QuickActionButton.tsx
"use client";

import Link from "next/link";

type QuickActionButtonProps = {
  title: string;
  href: string;
  primary?: boolean;
};

export default function QuickActionButton({
  title,
  href,
  primary,
}: QuickActionButtonProps) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition-all
      ${
        primary
          ? "bg-black text-white hover:bg-gray-800"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {title}
    </Link>
  );
}
