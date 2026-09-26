import type { LucideIcon } from "lucide-react";

export type Tone = "blue" | "red" | "slate" | "amber" | "emerald" | "violet";

export type ActionItem = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  tone: Tone;
};

export type OverviewItem = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: Tone;
  href: string;
};

export type ModuleLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type ManagementModule = {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: Tone;
  items: ModuleLink[];
};

export type FinanceModule = {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: Tone;
  href: string;
  label: string;
};

export type ToneStyles = Record<
  Tone,
  {
    icon: string;
    soft: string;
    hover: string;
    dot: string;
  }
>;

export type DashboardSidebarLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};
