"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
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
      className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-blue-100/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/40"
    >
      {/* Background Glow */}
      <div className="absolute -right-16 top-0 h-56 w-56 rounded-full bg-blue-100 blur-3xl" />
      <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-red-100 blur-3xl" />

      <div
        className={`relative grid gap-10 p-6 lg:p-8 ${
          reverse ? "lg:grid-cols-[1.1fr_0.9fr]" : "lg:grid-cols-[0.9fr_1.1fr]"
        }`}
      >
        {/* Image */}
        <div
          className={`${
            reverse ? "lg:order-2" : ""
          } relative overflow-hidden rounded-3xl border border-slate-200`}
        >
          <div className="relative aspect-[16/10]">
            <Image
              src={company.coverImage}
              alt={company.companyName}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          </div>

          {/* Status */}
          <div className="absolute left-5 top-5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 shadow-md">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              {company.status}
            </span>
          </div>

          {/* Logo */}
          <div className="absolute bottom-5 left-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
            <Image
              src={company.logo}
              alt={`${company.companyName} Logo`}
              width={60}
              height={60}
              className="object-contain"
            />
          </div>
        </div>

        {/* Content */}
        <div className={reverse ? "lg:order-1" : ""}>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-700">
              Currently Serving
            </span>
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            {company.companyName}
          </h2>

          <p className="mt-5 leading-8 text-slate-600">{company.description}</p>

          {/* Info */}
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
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-slate-900">
              Services Provided
            </h3>

            <div className="mt-5 flex flex-wrap gap-3">
              {company.services.map((service) => (
                <div
                  key={service}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:-translate-y-0.5"
                >
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-slate-700">{service}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {company.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <p className="text-xl font-bold text-blue-700">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
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
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md">
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
