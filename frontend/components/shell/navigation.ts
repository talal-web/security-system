import {
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  FileWarning,
  Gift,
  HandCoins,
  Layers3,
  LayoutDashboard,
  Map,
  MapPin,
  ReceiptText,
  UserCog,
  UserPlus,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

import type { UserRole } from "@/types/user";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Roles allowed to see the item. Mirrors each page's ProtectedRoute. */
  roles: UserRole[];
  /** Extra path prefixes that should mark this item active. */
  match?: string[];
  keywords?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

const ALL: UserRole[] = ["developer", "admin", "clerk", "supervisor"];
const STAFF: UserRole[] = ["developer", "admin", "clerk"];
const ADMIN: UserRole[] = ["developer", "admin"];

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ALL,
        keywords: "home overview",
      },
    ],
  },
  {
    label: "Workforce",
    items: [
      {
        label: "Employees",
        href: "/employees/view",
        icon: Users,
        roles: ALL,
        match: ["/employees"],
        keywords: "staff guards personnel",
      },
      {
        label: "Attendance Session",
        href: "/attendance/session",
        icon: CheckCircle2,
        roles: STAFF,
        keywords: "mark attendance today",
      },
      {
        label: "Daily Report",
        href: "/attendance/daily",
        icon: CalendarDays,
        roles: STAFF,
        keywords: "attendance daily report",
      },
      {
        label: "Monthly Report",
        href: "/attendance/monthly",
        icon: BarChart3,
        roles: STAFF,
        keywords: "attendance monthly report",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Locations",
        href: "/locations/view",
        icon: Building2,
        roles: ALL,
        match: ["/locations"],
        keywords: "posts sites",
      },
      {
        label: "Sectors",
        href: "/sectors/view",
        icon: Layers3,
        roles: ALL,
        match: ["/sectors"],
      },
      {
        label: "Areas",
        href: "/area",
        icon: Map,
        roles: ADMIN,
        keywords: "regions",
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        label: "Payroll",
        href: "/payroll",
        icon: WalletCards,
        roles: ALL,
        keywords: "salary salaries",
      },
      {
        label: "Advances",
        href: "/advances",
        icon: HandCoins,
        roles: ALL,
      },
      {
        label: "Bonuses",
        href: "/bonuses",
        icon: Gift,
        roles: ALL,
      },
      {
        label: "Deductions",
        href: "/deductions",
        icon: ReceiptText,
        roles: ALL,
      },
      {
        label: "Fines",
        href: "/fines",
        icon: FileWarning,
        roles: ALL,
        keywords: "penalties",
      },
      {
        label: "Invoice",
        href: "/invoice",
        icon: FileText,
        roles: ["developer"],
        keywords: "bill pdf",
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        label: "Users",
        href: "/users",
        icon: UserCog,
        roles: ADMIN,
        keywords: "accounts access permissions",
      },
    ],
  },
];

/** Quick-create actions surfaced in the command menu. */
export const quickActions: NavItem[] = [
  {
    label: "Add Employee",
    href: "/employees/create",
    icon: UserPlus,
    roles: STAFF,
    keywords: "new create employee",
  },
  {
    label: "Add User",
    href: "/users/create",
    icon: UserPlus,
    roles: ADMIN,
    keywords: "new create user account",
  },
  {
    label: "Create Sector",
    href: "/sectors/create",
    icon: Layers3,
    roles: STAFF,
    keywords: "new sector",
  },
  {
    label: "Create Location",
    href: "/locations/create",
    icon: MapPin,
    roles: STAFF,
    keywords: "new location post",
  },
];

export function getNavGroupsForRole(role?: UserRole) {
  if (!role) return [];

  return navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((group) => group.items.length > 0);
}

export function isNavItemActive(item: NavItem, pathname: string) {
  const prefixes = [item.href, ...(item.match ?? [])];

  if (item.href === "/dashboard") {
    return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  }

  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Human labels for breadcrumb segments. */
export const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  admin: "Admin",
  clerk: "Clerk",
  supervisor: "Supervisor",
  unauthorized: "Unauthorized",
  employees: "Employees",
  attendance: "Attendance",
  session: "Session",
  daily: "Daily Report",
  monthly: "Monthly Report",
  locations: "Locations",
  sectors: "Sectors",
  area: "Areas",
  payroll: "Payroll",
  advances: "Advances",
  bonuses: "Bonuses",
  deductions: "Deductions",
  fines: "Fines",
  salary: "Salary",
  invoice: "Invoice",
  users: "Users",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  view: "All",
};

/** Where a section-level breadcrumb should link to. */
export const segmentHrefs: Record<string, string> = {
  employees: "/employees/view",
  locations: "/locations/view",
  sectors: "/sectors/view",
  attendance: "/attendance/daily",
  dashboard: "/dashboard",
};
