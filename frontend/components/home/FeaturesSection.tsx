// src/components/home/FeaturesSection.tsx

"use client";

import { motion } from "framer-motion";
import { Shield, MapPinned, ClipboardCheck, UserCheck } from "lucide-react";

const features = [
  {
    title: "Guard Management",
    description: "Manage personnel efficiently.",
    icon: UserCheck,
  },
  {
    title: "Attendance",
    description: "Track attendance and shifts.",
    icon: ClipboardCheck,
  },
  {
    title: "Deployment",
    description: "Assign guards to locations.",
    icon: MapPinned,
  },
  {
    title: "Security",
    description: "Secure and reliable platform.",
    icon: Shield,
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.1),transparent_42%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Features
          </p>

          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl">
            Everything You Need
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-50 to-red-50 text-blue-600 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
