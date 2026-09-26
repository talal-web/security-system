import {
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileWarning,
  Gift,
  HandCoins,
  Map,
  MapPin,
  ReceiptText,
  ShieldCheck,
  UserCog,
  UserPlus,
  Users,
  WalletCards,
} from "lucide-react";

import type {
  ActionItem,
  DashboardSidebarLink,
  FinanceModule,
  ManagementModule,
  OverviewItem,
  ToneStyles,
} from "@/components/admin/dashboard.types";

export const toneStyles: ToneStyles = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    soft: "bg-blue-50/60",
    hover: "hover:border-blue-200 hover:bg-blue-50/40",
    dot: "bg-blue-500",
  },
  red: {
    icon: "bg-red-50 text-red-600",
    soft: "bg-red-50/60",
    hover: "hover:border-red-200 hover:bg-red-50/40",
    dot: "bg-red-500",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    soft: "bg-amber-50/60",
    hover: "hover:border-amber-200 hover:bg-amber-50/40",
    dot: "bg-amber-500",
  },
  slate: {
    icon: "bg-slate-100 text-slate-600",
    soft: "bg-slate-50",
    hover: "hover:border-slate-300 hover:bg-slate-50",
    dot: "bg-slate-500",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    soft: "bg-emerald-50/60",
    hover: "hover:border-emerald-200 hover:bg-emerald-50/40",
    dot: "bg-emerald-500",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
    soft: "bg-violet-50/60",
    hover: "hover:border-violet-200 hover:bg-violet-50/40",
    dot: "bg-violet-500",
  },
};

export const overviewItems: OverviewItem[] = [
  {
    label: "Employees",
    value: "Manage",
    icon: Users,
    tone: "slate",
    href: "/employees/view",
  },
  {
    label: "Attendance",
    value: "Manage",
    icon: CheckCircle2,
    tone: "blue",
    href: "/attendance/session",
  },
  {
    label: "Advances",
    value: "Manage",
    icon: HandCoins,
    tone: "amber",
    href: "/advances",
  },
  {
    label: "Bonuses",
    value: "Manage",
    icon: Gift,
    tone: "emerald",
    href: "/bonuses",
  },
  {
    label: "Deductions",
    value: "Manage",
    icon: ReceiptText,
    tone: "violet",
    href: "/deductions",
  },
  {
    label: "Fines",
    value: "Manage",
    icon: FileWarning,
    tone: "red",
    href: "/fines",
  },
  {
    label: "Payroll",
    value: "Manage",
    icon: WalletCards,
    tone: "violet",
    href: "/payroll",
  },
  {
    label: "Users",
    value: "Manage",
    icon: UserCog,
    tone: "blue",
    href: "/users",
  },
  {
    label: "Areas",
    value: "Manage",
    icon: Map,
    tone: "emerald",
    href: "/area",
  },
];

export const primaryActions: ActionItem[] = [
  {
    title: "Manage Employees",
    description: "Employee records & profiles",
    href: "/employees/view",
    icon: Users,
    tone: "slate",
  },
  {
    title: "Attendance Session",
    description: "Mark today's attendance",
    href: "/attendance/session",
    icon: CheckCircle2,
    tone: "blue",
  },
  {
    title: "Manage Advances",
    description: "Employee salary advances",
    href: "/advances",
    icon: HandCoins,
    tone: "amber",
  },
  {
    title: "Manage Bonuses",
    description: "Employee bonuses & payments",
    href: "/bonuses",
    icon: Gift,
    tone: "emerald",
  },
  {
    title: "Manage Deductions",
    description: "Salary deductions",
    href: "/deductions",
    icon: ReceiptText,
    tone: "violet",
  },
  {
    title: "Manage Fines",
    description: "Employee fines & penalties",
    href: "/fines",
    icon: FileWarning,
    tone: "red",
  },
  {
    title: "Monthly Attendance",
    description: "Attendance reports",
    href: "/attendance/monthly",
    icon: BarChart3,
    tone: "emerald",
  },
  {
    title: "Manage Payroll",
    description: "Generate, finalize, and pay salaries",
    href: "/payroll",
    icon: WalletCards,
    tone: "violet",
  },
  {
    title: "Manage Areas",
    description: "Manage BWC, RWP, and other areas",
    href: "/area",
    icon: Map,
    tone: "emerald",
  },
];

export const managementModules: ManagementModule[] = [
  {
    title: "Users",
    description: "System access & permissions",
    icon: UserCog,
    tone: "blue",
    items: [
      { label: "View Users", href: "/users", icon: UserCog },
      { label: "Add User", href: "/users/create", icon: UserPlus },
    ],
  },
  {
    title: "Employees",
    description: "Employee records & profiles",
    icon: Users,
    tone: "slate",
    items: [
      { label: "View Employees", href: "/employees/view", icon: Users },
      { label: "Add Employee", href: "/employees/create", icon: UserPlus },
    ],
  },
  {
    title: "Areas",
    description: "Manage organization areas",
    icon: Map,
    tone: "emerald",
    items: [{ label: "View Areas", href: "/area", icon: Map }],
  },
  {
    title: "Sectors",
    description: "Security sector management",
    icon: MapPin,
    tone: "emerald",
    items: [{ label: "View Sectors", href: "/sectors/view", icon: MapPin }],
  },
  {
    title: "Locations",
    description: "Security post management",
    icon: Building2,
    tone: "blue",
    items: [
      { label: "View Locations", href: "/locations/view", icon: Building2 },
    ],
  },
];

export const financeModules: FinanceModule[] = [
  {
    title: "Payroll",
    description: "Generate, review, finalize, and pay salaries",
    icon: WalletCards,
    tone: "violet",
    href: "/payroll",
    label: "Manage Payroll",
  },
  {
    title: "Advances",
    description: "Employee salary advances",
    icon: HandCoins,
    tone: "amber",
    href: "/advances",
    label: "Manage Advances",
  },
  {
    title: "Bonuses",
    description: "Employee bonuses & payments",
    icon: Gift,
    tone: "emerald",
    href: "/bonuses",
    label: "Manage Bonuses",
  },
  {
    title: "Deductions",
    description: "Salary deductions & adjustments",
    icon: ReceiptText,
    tone: "violet",
    href: "/deductions",
    label: "Manage Deductions",
  },
  {
    title: "Fines",
    description: "Employee fines & penalties",
    icon: FileWarning,
    tone: "red",
    href: "/fines",
    label: "Manage Fines",
  },
];

export const systemStatus = [
  "User Management",
  "Employee Records",
  "Attendance",
  "Payroll & Finance",
  "Locations",
];

export const attendanceLinks: DashboardSidebarLink[] = [
  {
    href: "/attendance/session",
    label: "Attendance Session",
    icon: CheckCircle2,
  },
  {
    href: "/attendance/daily",
    label: "Daily Report",
    icon: CalendarDays,
  },
  {
    href: "/attendance/monthly",
    label: "Monthly Report",
    icon: BarChart3,
  },
];

export const payrollLinks: DashboardSidebarLink[] = [
  {
    href: "/advances",
    label: "Employee Advances",
    icon: HandCoins,
  },
  {
    href: "/bonuses",
    label: "Employee Bonuses",
    icon: Gift,
  },
  {
    href: "/deductions",
    label: "Salary Deductions",
    icon: ReceiptText,
  },
  {
    href: "/fines",
    label: "Employee Fines",
    icon: FileWarning,
  },
  {
    href: "/payroll",
    label: "Payroll",
    icon: WalletCards,
  },
];

export const quickAdminLinks: DashboardSidebarLink[] = [
  {
    href: "/users/create",
    label: "Add User",
    icon: UserPlus,
  },
  {
    href: "/employees/create",
    label: "Add Employee",
    icon: UserPlus,
  },
];

export const dashboardHeaderActions = [
  {
    href: "/employees/view",
    label: "View Employees",
    icon: Users,
    variant: "primary",
  },
  {
    href: "/attendance/monthly",
    label: "Reports",
    icon: BarChart3,
    variant: "secondary",
  },
] as const;

export const adminPortalBadge = {
  title: "Administration Portal",
  icon: ShieldCheck,
};

export const sectionClassName = "";

export const sectionHeadingDescription = "";
