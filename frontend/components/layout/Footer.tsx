"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/employees/view", label: "Employees" },
  { href: "/locations/view", label: "Locations" },
];

export default function Footer() {
  const companyPhone =
    process.env.NEXT_PUBLIC_COMPANY_PHONE || "+92 335 5111150";

  return (
    <footer className="border-t border-slate-200 bg-white print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          {/* Logo */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Baidar Security"
                width={40}
                height={40}
                className="rounded-lg"
              />

              <div>
                <h2 className="text-base font-semibold tracking-tight text-slate-900">
                  Baidar Security
                </h2>
                <p className="text-xs text-slate-500">Workforce Management</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              A modern platform for managing guards, attendance, locations, and
              reports.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Navigation
            </h3>

            <div className="space-y-2">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-slate-500 transition-colors hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Contact
            </h3>

            <div className="space-y-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                Rawalpindi, Pakistan
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                {companyPhone}
              </div>

              <div className="flex min-w-0 items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="break-all">info@baidarsecurity.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 md:flex md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Baidar Security Service</p>

          <p className="mt-3 md:mt-0">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
