"use client";

import Link from "next/link";

import { useState } from "react";

import { Menu, X, ShieldCheck, ArrowRight } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },

  { name: "About", href: "/about" },

  { name: "Locations", href: "/locations/view" },

  { name: "Employee", href: "/employees/view" },

  { name: "Attendance", href: "/attendance" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-2xl dark:border-neutral-800 dark:bg-neutral-950/80 print:hidden">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ================= LOGO ================= */}

        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>

          <div>
            <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
              Baidar Security
            </h2>

            <p className="text-xs font-medium text-gray-500 dark:text-neutral-400">
              Workforce Management System
            </p>
          </div>
        </Link>

        {/* ================= DESKTOP NAV ================= */}

        <nav className="hidden items-center gap-1 rounded-full border border-gray-200 bg-white/70 p-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/70 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="rounded-full px-5 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-blue-50 hover:text-blue-600 dark:text-neutral-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* ================= CTA ================= */}

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 transition hover:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-400"
          >
            Login
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ================= MOBILE BUTTON ================= */}

        <button
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}

      {open && (
        <div className="border-t border-gray-200 bg-white/95 backdrop-blur-2xl dark:border-neutral-800 dark:bg-neutral-950/95 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-600 dark:text-neutral-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-800"
              >
                Login
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
