"use client";

import { Building2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import CompanyCard from "./CompanyCard";
import { companies } from "./company-data";

export default function CompanyShowcase() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-8 lg:p-10">
      <div className="relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-card">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            Trusted Clients
          </div>

          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Trusted Client Network
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Active partnerships across residential and commercial operations.
          </p>

          <div className="mt-6 inline-flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2">
            <Building2 className="h-4 w-4 text-blue-600" />

            <span className="text-sm font-semibold text-slate-700">
              {companies.length} Active Client{companies.length !== 1 && "s"}
            </span>
          </div>
        </motion.div>

        {/* Companies */}
        <div className="mt-8 space-y-4 sm:mt-10 lg:space-y-6">
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
