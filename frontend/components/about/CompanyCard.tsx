"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { Company } from "./company-data";

interface CompanyCardProps {
  company: Company;
  reverse?: boolean;
}

export default function CompanyCard({
  company,
  reverse = false,
}: CompanyCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-red-100/40 blur-3xl" />

      <div
        className={`relative grid gap-8 p-6 sm:p-8 ${
          reverse
            ? "lg:grid-cols-[1.05fr_0.95fr]"
            : "lg:grid-cols-[0.95fr_1.05fr]"
        } lg:items-center`}
      >
        <div
          className={`relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 ${
            reverse ? "lg:order-2" : ""
          }`}
        >
          <div className="relative aspect-4/3 sm:aspect-16/10">
            <Image
              src={company.coverImage}
              alt={company.companyName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="absolute left-4 top-4 rounded-full border border-emerald-200 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
              {company.status}
            </span>
          </div>

          {/* Logo */}
          <div className="absolute bottom-3 left-3 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-md sm:bottom-4 sm:left-4 sm:h-14 sm:w-14 sm:rounded-2xl lg:h-16 lg:w-16">
            <Image
              src={company.logo}
              alt={`${company.companyName} Logo`}
              width={40}
              height={40}
              className="h-7 w-7 object-contain sm:h-9 sm:w-9 lg:h-11 lg:w-11"
            />
          </div>
        </div>

        <div className={reverse ? "lg:order-1" : ""}>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
            <ShieldCheck className="h-4 w-4" />
            Active Client
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {company.companyName}
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {company.description}
          </p>

          {/* Company Info */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <InfoItem
              icon={<MapPin className="h-5 w-5" />}
              title="Location"
              value={company.location}
            />

            <InfoItem
              icon={<Building2 className="h-5 w-5" />}
              title="Partnership"
              value={company.partnership}
            />

            <InfoItem
              icon={<BadgeCheck className="h-5 w-5" />}
              title="Status"
              value={company.status}
            />

            <InfoItem
              icon={<CalendarDays className="h-5 w-5" />}
              title="Since"
              value={company.since}
            />
          </div>

          {/* Services */}
          <div className="mt-8">
            <div className="flex flex-wrap gap-2">
              {company.services.map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {company.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <p className="text-sm font-black text-blue-600">{stat.value}</p>

                <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function InfoItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-4 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md">
      <div className="rounded-xl bg-blue-100 p-2 text-blue-600">{icon}</div>

      <div>
        <p className="text-xs uppercase tracking-wider text-slate-500">
          {title}
        </p>

        <p className="mt-1 font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}
