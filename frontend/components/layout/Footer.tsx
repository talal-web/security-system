// src/components/layout/Footer.tsx

import Link from "next/link";
import { ShieldCheck, Mail, Phone, MapPin, Globe, Globe2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 shadow-md">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                Baidar Security
              </h2>
              <p className="text-xs text-slate-500">Security Service</p>
            </div>
          </div>

          <p className="text-sm leading-7 text-slate-600">
            Professional security management system for handling guards,
            operations, attendance, reports, and deployment records.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="mb-5 text-lg font-semibold text-slate-900">
            Quick Links
          </h3>

          <div className="flex flex-col gap-3">
            <FooterLink href="/" label="Home" />
            <FooterLink href="/employees" label="Employees" />
            <FooterLink href="/dashboard" label="Dashboard" />
            <FooterLink href="/reports" label="Reports" />
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-5 text-lg font-semibold text-slate-900">
            Services
          </h3>

          <div className="space-y-3 text-sm text-slate-600">
            <p>Security Guard Management</p>
            <p>Attendance Monitoring</p>
            <p>Incident Reporting</p>
            <p>Deployment Tracking</p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-lg font-semibold text-slate-900">Contact</h3>

          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-4 w-4 text-blue-600" />
              <p>Islamabad, Pakistan</p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-blue-600" />
              <p>+92 300 0000000</p>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-blue-600" />
              <p>info@baidarsecurity.com</p>
            </div>

            {/* Social */}
            <div className="flex gap-3 pt-3">
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

      {/* Bottom */}
      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-slate-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} Baidar Security Service. All rights
            reserved.
          </p>

          <p>Built with Next.js & Tailwind CSS</p>
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

function SocialIcon({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600">
      {children}
    </button>
  );
}
