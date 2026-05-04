// src/components/home/HeroSection.tsx

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  MapPinned,
  ClipboardCheck,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-2 shadow-sm"
        >
          <ShieldCheck className="h-4 w-4 text-blue-600" />

          <span className="text-sm font-medium text-slate-700">
            Professional Security Management Platform
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl text-center text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-7xl"
        >
          Baidar Security Service
        </motion.h1>

        {/* Paragraph */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-2xl text-center text-base leading-8 text-slate-600 sm:text-lg"
        >
          Complete modern security company management system for handling
          employees, deployment locations, attendance, reports, records, and
          operational monitoring.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/employees"
            className="group inline-flex items-center justify-center rounded-2xl bg-blue-600 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700"
          >
            Manage Employees
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 py-4 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-blue-300 hover:bg-blue-50"
          >
            Open Dashboard
          </Link>
        </motion.div>

        {/* Feature Cards */}
        <div className="mt-20 grid w-full gap-6 md:grid-cols-3">
          <FeatureMiniCard
            icon={<Users className="h-6 w-6 text-blue-600" />}
            title="Employee Management"
            description="Handle employee records and profiles professionally."
          />

          <FeatureMiniCard
            icon={<MapPinned className="h-6 w-6 text-indigo-600" />}
            title="Location Tracking"
            description="Monitor deployment locations and security posts."
          />

          <FeatureMiniCard
            icon={<ClipboardCheck className="h-6 w-6 text-cyan-600" />}
            title="Attendance System"
            description="Track attendance and operational activities easily."
          />
        </div>
      </div>
    </section>
  );
}

type FeatureMiniCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FeatureMiniCard({ icon, title, description }: FeatureMiniCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-3xl border border-white/60 bg-white/70 p-7 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
        {icon}
      </div>

      <h3 className="mb-3 text-xl font-bold text-slate-900">{title}</h3>

      <p className="text-sm leading-7 text-slate-600">{description}</p>
    </motion.div>
  );
}
