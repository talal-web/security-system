// src/components/home/FeaturesSection.tsx

"use client";

import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  MapPinned,
  BellRing,
  ClipboardCheck,
  UserCheck,
} from "lucide-react";

const features = [
  {
    title: "Guard Management",
    description:
      "Coordinate security personnel and daily operations from a single workspace.",
    icon: UserCheck,
  },
  {
    title: "Attendance Monitoring",
    description:
      "Track shifts, punctuality and workforce activity with dependable visibility.",
    icon: ClipboardCheck,
  },
  {
    title: "Location Deployment",
    description:
      "Assign guards to sites quickly with clear deployment updates and routing.",
    icon: MapPinned,
  },
  {
    title: "Incident Reports",
    description:
      "Create, manage and review operational reports with professional detail.",
    icon: FileText,
  },
  {
    title: "Emergency Alerts",
    description:
      "Deliver instant alerts and notifications so your team can respond fast.",
    icon: BellRing,
  },
  {
    title: "Advanced Security",
    description:
      "Protect sensitive information with secure, modern infrastructure and controls.",
    icon: Shield,
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.1),transparent_42%)]" />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Features
          </p>
          <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl text-slate-900">
            Built for secure, reliable operations
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
            Every module is designed to give your security team stronger
            oversight, faster communication and smoother day-to-day execution.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-red-100 text-blue-600">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-7 text-slate-600">
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
