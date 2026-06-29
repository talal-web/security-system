"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Locations", href: "/locations/view" },
  { name: "Employees", href: "/employees/view" },
  { name: "Attendance", href: "/attendance" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-white/95 shadow-sm shadow-slate-200/40 backdrop-blur-xl print:hidden">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative h-12 w-12 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="Baidar Security Logo"
              width={48}
              height={48}
              priority
              className="rounded-xl"
            />
          </div>

          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              Baidar Security
            </h2>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
              Workforce Management
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-slate-50 p-1.5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-50 hover:text-blue-700"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-700 transition hover:text-red-600"
          >
            Login
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-600 via-sky-500 to-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200/40 transition-all hover:-translate-y-0.5 hover:brightness-110"
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200/70 bg-white/95 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-blue-50 hover:text-blue-700"
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-2xl bg-linear-to-r from-blue-600 via-sky-500 to-red-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-blue-200/30"
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
