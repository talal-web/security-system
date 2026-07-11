// src/components/layout/Footer.tsx

import Link from "next/link";
import type { ReactNode } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Globe, Globe2, ArrowRight } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/employees/view", label: "Employees" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/locations/view", label: "Locations" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-slate-50 text-slate-800 print:hidden">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 rounded-4xl border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-200/40 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-5 flex items-center gap-3">
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
                <h2 className="text-lg font-semibold text-slate-900">
                  Baidar Security
                </h2>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Security Service
                </p>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              Professional security management for guards, attendance,
              deployment, and daily operations with a clear, reliable overview.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold text-slate-900">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <FooterLink
                  key={link.label}
                  href={link.href}
                  label={link.label}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold text-slate-900">
              Services
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>Guard roster management</li>
              <li>Attendance monitoring</li>
              <li>Incident reporting</li>
              <li>Deployment tracking</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold text-slate-900">
              Contact
            </h3>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-blue-500" />
                <p>Rawalpindi, Pakistan</p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-red-500" />
                <p>{process.env.NEXT_PUBLIC_COMPANY_PHONE}</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-500" />
                <p>info@baidarsecurity.com</p>
              </div>

              <div className="flex gap-3 pt-2">
                <SocialIcon>
                  <Globe className="h-4 w-4" />
                </SocialIcon>
                <SocialIcon>
                  <Globe2 className="h-4 w-4" />
                </SocialIcon>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200/70 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Baidar Security Service. All rights
            reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-600">
            <span>Built for secure operations</span>
            <ArrowRight className="h-4 w-4 text-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm text-slate-600 transition hover:text-blue-600"
    >
      {label}
    </Link>
  );
}

function SocialIcon({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-blue-300/60 hover:text-blue-600">
      {children}
    </div>
  );
}
