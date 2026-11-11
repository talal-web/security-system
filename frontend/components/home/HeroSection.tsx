"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";

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
    <section className="relative overflow-hidden border-b border-slate-200/80 bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-size-[56px_56px] opacity-60" />
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
          className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]"
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
          className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-400/10 blur-[100px]"
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
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-card"
            >
              <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" />
              <span className="text-xs font-medium text-slate-600 sm:text-sm">
                Professional Security Workforce Management
              </span>
            </motion.div>

            <motion.h1
              custom={0.15}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              Baidar <span className="text-blue-600">Security</span>
              <br />
              <span className="text-slate-500">Service</span>
            </motion.h1>

            <motion.p
              custom={0.3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8"
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
              <Button
                size="lg"
                onClick={onLoginClick}
                className="group h-11 w-full px-5 sm:w-auto"
              >
                Secure Login
                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={onLoginClick}
                className="h-11 w-full px-5 sm:w-auto"
              >
                Open Dashboard
              </Button>
            </motion.div>

            <motion.div
              custom={0.6}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-12 grid grid-cols-2 gap-3 xl:grid-cols-4"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-5"
                >
                  <div className="text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
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
