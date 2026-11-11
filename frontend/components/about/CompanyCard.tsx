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
      className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-card"
    >
      <div
        className={`relative grid gap-6 p-4 sm:gap-8 sm:p-6 lg:p-8 ${
          reverse
            ? "lg:grid-cols-[1.05fr_0.95fr]"
            : "lg:grid-cols-[0.95fr_1.05fr]"
        } lg:items-center`}
      >
        <div
          className={`relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ${
            reverse ? "lg:order-2" : ""
          }`}
        >
          <div className="relative aspect-4/3 sm:aspect-16/10">
            <Image
              src={company.coverImage}
              alt={company.companyName}
              fill
              className="object-cover"
            />
          </div>

          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2 py-0.5 text-xs font-medium text-emerald-700 shadow-card ring-1 ring-inset ring-emerald-600/20 backdrop-blur sm:left-4 sm:top-4">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {company.status}
          </div>

          {/* Logo */}
          <div className="absolute bottom-3 left-3 flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-card sm:bottom-4 sm:left-4 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
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
          <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            Active Client
          </div>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {company.companyName}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            {company.description}
          </p>

          {/* Company Info */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {company.services.map((service) => (
                <span
                  key={service}
                  className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-500/15"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {company.stats.map((stat) => (
              <div
                key={stat.label}
                className="min-w-0 rounded-lg border border-slate-200/80 bg-slate-50/60 p-3 text-center sm:p-4"
              >
                <p className="break-words text-sm font-semibold text-slate-900">
                  {stat.value}
                </p>

                <p className="mt-0.5 break-words text-xs text-slate-500">
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
    <div className="flex items-start gap-3 rounded-lg border border-slate-200/80 bg-white p-3 sm:p-4">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200 [&_svg]:size-4">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500">{title}</p>

        <p className="mt-0.5 text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}
