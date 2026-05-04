// src/components/home/StatsSection.tsx

"use client";

import { motion } from "framer-motion";
import { Shield, Users, Building2, Activity } from "lucide-react";

const stats = [
  {
    title: "500+",
    subtitle: "Security Guards",
    icon: Users,
  },
  {
    title: "120+",
    subtitle: "Client Locations",
    icon: Building2,
  },
  {
    title: "24/7",
    subtitle: "Monitoring",
    icon: Activity,
  },
  {
    title: "99%",
    subtitle: "Operational Efficiency",
    icon: Shield,
  },
];

export default function StatsSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.subtitle}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-8 shadow-lg shadow-slate-100 transition-all"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>

                <h3 className="text-4xl font-black text-slate-900">
                  {stat.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600">{stat.subtitle}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
