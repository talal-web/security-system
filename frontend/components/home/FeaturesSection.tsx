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
    <section className="relative overflow-hidden bg-slate-50 py-16 text-slate-900 sm:py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-12">
          <p className="mb-2 text-sm font-medium text-blue-600">
            Features
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Everything You Need
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group rounded-xl border border-slate-200/80 bg-white p-6 shadow-card transition-colors duration-200 hover:border-slate-300"
              >
                <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
                  <Icon className="size-5" />
                </div>

                <h3 className="text-base font-semibold text-slate-900">
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
