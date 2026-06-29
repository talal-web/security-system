// src/components/home/StatsSection.tsx

"use client";

import { motion } from "framer-motion";
import { Shield, Users, Building2, Activity } from "lucide-react";

const stats = [
  { title: "500+", subtitle: "Security Guards", icon: Users },
  { title: "120+", subtitle: "Client Locations", icon: Building2 },
  { title: "24/7", subtitle: "Monitoring", icon: Activity },
  { title: "99%", subtitle: "Operational Efficiency", icon: Shield },
];

export default function StatsSection() {
  return (
    <section className="bg-slate-50 py-20 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
              Trusted Impact
            </p>
            <h2 className="text-3xl font-black sm:text-4xl">
              Scalable protection, measurable results
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Designed for teams that need dependable monitoring, accurate records
            and a professional security workflow every day.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.subtitle}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-600 to-red-600" />
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-100 to-red-100 text-blue-600">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-4xl font-black text-slate-900">
                  {stat.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{stat.subtitle}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
