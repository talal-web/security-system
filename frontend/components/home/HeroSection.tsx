// src/components/home/HeroSection.tsx

"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  MapPinned,
  ClipboardCheck,
  Activity,
  Clock3,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const stats = [
  { value: "120+", label: "Security Personnel" },
  { value: "75+", label: "Deployment Locations" },
  { value: "99%", label: "Attendance Accuracy" },
  { value: "24/7", label: "Operations" },
];

interface HeroSectionProps {
  onLoginClick: () => void;
}

export default function HeroSection({ onLoginClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-slate-50 via-slate-100 to-white text-slate-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-size-[56px_56px]" />
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            x: [0, 28, 0],
            y: [0, -16, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-blue-500/15 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.05, 1, 1.05],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
          className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-red-500/10 blur-[100px]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex items-center gap-3 rounded-full border border-blue-200 bg-white/90 px-5 py-2 shadow-sm"
            >
              <ShieldCheck className="h-5 w-5 text-red-500" />
              <span className="text-sm font-semibold tracking-wide text-slate-700">
                Professional Security Workforce Management
              </span>
            </motion.div>

            <motion.h1
              custom={0.15}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-8 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            >
              Baidar <span className="text-blue-600">Security</span>
              <br />
              <span className="text-red-600">Service</span>
            </motion.h1>

            <motion.p
              custom={0.3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-6 max-w-xl text-lg leading-8 text-slate-600"
            >
              A modern platform for managing guards, attendance, deployment
              locations, reports and day-to-day security operations with clarity
              and control.
            </motion.p>

            <motion.div
              custom={0.45}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <button
                type="button"
                onClick={onLoginClick}
                className="group inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-blue-600 to-sky-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-sky-500/20 transition-all duration-300 hover:-translate-y-1 hover:from-blue-700 hover:to-sky-600"
              >
                Secure Login
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={onLoginClick}
                className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-white px-7 py-3.5 font-semibold text-slate-900 transition-all duration-300 hover:border-red-300 hover:bg-red-50"
              >
                Open Dashboard
              </button>
            </motion.div>

            <motion.div
              custom={0.6}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="text-2xl font-black text-slate-900">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.25,
            }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -left-4 top-8 z-20 hidden rounded-3xl border border-blue-100 bg-white/95 px-4 py-3 shadow-lg lg:flex"
            >
              <ShieldCheck className="mr-2 h-5 w-5 text-blue-600" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  System Status
                </p>
                <p className="font-semibold text-blue-600">
                  All Systems Operational
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01, rotate: -0.5 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
            >
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 sm:px-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Security Dashboard
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Real-time Operations
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="space-y-5 p-6 sm:p-8">
                <div className="grid grid-cols-2 gap-4">
                  <DashboardCard
                    icon={<Users className="h-5 w-5 text-blue-600" />}
                    title="Employees"
                    value="125"
                  />
                  <DashboardCard
                    icon={<ClipboardCheck className="h-5 w-5 text-red-600" />}
                    title="Attendance"
                    value="98%"
                  />
                  <DashboardCard
                    icon={<MapPinned className="h-5 w-5 text-sky-500" />}
                    title="Locations"
                    value="75"
                  />
                  <DashboardCard
                    icon={<Clock3 className="h-5 w-5 text-orange-500" />}
                    title="Active Shift"
                    value="124"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-medium text-slate-700">
                      Today&apos;s Attendance
                    </span>
                    <span className="font-semibold text-blue-600">96%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "96%" }}
                      transition={{ duration: 1.2, delay: 0.8 }}
                      className="h-full rounded-full bg-linear-to-r from-blue-500 via-cyan-500 to-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <StatusItem text="Employee Database Updated" />
                  <StatusItem text="Attendance Successfully Recorded" />
                  <StatusItem text="Deployment Locations Synced" />
                  <StatusItem text="Security Reports Generated" />
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-6 right-0 hidden rounded-2xl border border-red-500/20 bg-slate-950/80 p-4 shadow-xl backdrop-blur lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-red-500/15 p-2.5">
                  <BarChart3 className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    Performance
                  </p>
                  <p className="text-xl font-black text-white">99.2%</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

type DashboardCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
};

function DashboardCard({ icon, title, value }: DashboardCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-xl bg-blue-50 p-2.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
          {icon}
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
          Live
        </span>
      </div>
      <h4 className="text-sm font-medium text-slate-600">{title}</h4>
      <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
    </motion.div>
  );
}

type StatusItemProps = {
  text: string;
};

function StatusItem({ text }: StatusItemProps) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors hover:bg-slate-100"
    >
      <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />
      <span className="text-sm text-slate-700">{text}</span>
    </motion.div>
  );
}
