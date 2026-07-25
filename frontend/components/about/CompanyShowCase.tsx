"use client";

import { Building2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import CompanyCard from "./CompanyCard";
import { companies } from "./company-data";

export default function CompanyShowcase() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-linear-to-br from-white via-slate-50 to-blue-50/40 p-5 shadow-xl shadow-blue-100/35 sm:p-8 lg:p-10">
      {/* Background Glow */}
      <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-blue-100 blur-3xl opacity-70" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-red-100 blur-3xl opacity-60" />

      <div className="relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
            <ShieldCheck className="h-4 w-4" />
            Trusted Clients
          </div>

          <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Trusted Client Network
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Active partnerships across residential and commercial operations.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md">
            <Building2 className="h-5 w-5 text-blue-600" />

            <span className="text-sm font-semibold text-slate-700">
              {companies.length} Active Client{companies.length !== 1 && "s"}
            </span>
          </div>
        </motion.div>

        {/* Companies */}
        <div className="mt-10 space-y-6 lg:space-y-8">
          {companies.map((company, index) => (
            <CompanyCard
              key={company.id}
              company={company}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
