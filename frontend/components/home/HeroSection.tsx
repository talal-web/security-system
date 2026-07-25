"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

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

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-10">
          <div className="mx-auto max-w-3xl xl:mx-0">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex w-full items-center gap-3 rounded-full border border-blue-200 bg-white/90 px-4 py-2.5 shadow-sm sm:w-auto sm:px-5"
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
              className="mt-8 text-4xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl xl:text-7xl"
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
              className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg"
            >
              A modern platform for managing guards, attendance, deployment
              locations, and reports.
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
                className="group inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-blue-600 to-sky-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-sky-500/20 transition-all duration-300 hover:-translate-y-1 hover:from-blue-700 hover:to-sky-600 sm:w-auto"
              >
                Secure Login
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={onLoginClick}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-red-200 bg-white px-7 py-3.5 font-semibold text-slate-900 transition-all duration-300 hover:border-red-300 hover:bg-red-50 sm:w-auto"
              >
                Open Dashboard
              </button>
            </motion.div>

            <motion.div
              custom={0.6}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
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
        </div>
      </div>
    </section>
  );
}
