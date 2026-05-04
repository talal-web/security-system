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
      "Manage all security guards and employee records in one place.",
    icon: UserCheck,
  },
  {
    title: "Attendance Monitoring",
    description: "Track attendance, shifts, and operational activities easily.",
    icon: ClipboardCheck,
  },
  {
    title: "Location Deployment",
    description: "Assign guards to different locations professionally.",
    icon: MapPinned,
  },
  {
    title: "Incident Reports",
    description: "Generate and maintain detailed operational reports.",
    icon: FileText,
  },
  {
    title: "Emergency Alerts",
    description:
      "Receive emergency notifications and security updates instantly.",
    icon: BellRing,
  },
  {
    title: "Advanced Security",
    description: "Modern secure system architecture for company operations.",
    icon: Shield,
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Features
          </p>

          <h2 className="text-3xl font-black text-slate-900 sm:text-5xl">
            Complete Security Management System
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-600">
            Powerful and modern tools designed for professional security company
            operations and employee management.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-100 transition-all duration-300 hover:border-blue-200"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 transition-all group-hover:scale-110">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>

                <h3 className="mb-4 text-xl font-bold text-slate-900">
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
