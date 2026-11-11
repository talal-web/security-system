"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useMe } from "@/hooks/auth/useMe";
import { useSelectedArea } from "@/components/area/AreaContext";
import {
  getNavGroupsForRole,
  isNavItemActive,
} from "@/components/shell/navigation";
import UserAvatar from "@/components/shell/UserAvatar";

interface AppSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
}

export default function AppSidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapsed,
}: AppSidebarProps) {
  const pathname = usePathname();
  const { data } = useMe();
  const { getAreaAwareHref, selectedArea } = useSelectedArea();

  const user = data?.user;
  const groups = getNavGroupsForRole(user?.role);

  // The mobile drawer always shows full labels.
  const renderNav = (isCollapsed: boolean) => (
    <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-4">
      {groups.map((group, index) => (
        <div key={group.label} className={cn(index > 0 && "mt-5")}>
          {isCollapsed ? (
            index > 0 && <div className="mx-2 mb-3 border-t border-slate-200" />
          ) : (
            <p className="mb-1.5 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {group.label}
            </p>
          )}

          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isNavItemActive(item, pathname);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={getAreaAwareHref(item.href)}
                    onClick={onCloseMobile}
                    title={isCollapsed ? item.label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex h-9 items-center gap-3 rounded-lg px-2.5 text-sm font-medium transition-colors",
                      isCollapsed && "justify-center px-0",
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    )}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="absolute -left-3 top-1.5 h-6 w-1 rounded-r-full bg-blue-600"
                      />
                    )}
                    <Icon
                      className={cn(
                        "size-[18px] shrink-0",
                        active
                          ? "text-blue-600"
                          : "text-slate-400 group-hover:text-slate-600",
                      )}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const brand = (isCollapsed: boolean) => (
    <Link
      href={getAreaAwareHref("/dashboard")}
      onClick={onCloseMobile}
      className={cn(
        "flex min-w-0 items-center gap-2.5",
        isCollapsed && "justify-center",
      )}
    >
      <div className="relative size-9 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <Image
          src="/images/logo.png"
          alt="Baidar Security"
          fill
          sizes="36px"
          className="object-contain p-0.5"
          priority
        />
      </div>
      {!isCollapsed && (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            Baidar Security
          </p>
          <p className="truncate text-[11px] text-slate-500">
            Workforce Management
          </p>
        </div>
      )}
    </Link>
  );

  const profile = (isCollapsed: boolean) =>
    user && (
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/80 p-2",
          isCollapsed && "justify-center border-transparent bg-transparent p-0",
        )}
        title={isCollapsed ? `${user.name} (${user.role})` : undefined}
      >
        <UserAvatar name={user.name} />
        {!isCollapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              {user.name}
            </p>
            <p className="truncate text-xs capitalize text-slate-500">
              {user.role}
              {selectedArea ? ` · ${selectedArea.name}` : ""}
            </p>
          </div>
        )}
      </div>
    );

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-slate-200 bg-white transition-[width] duration-200 lg:flex print:hidden",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-slate-200 px-4",
            collapsed && "justify-center px-0",
          )}
        >
          {brand(collapsed)}
        </div>

        {renderNav(collapsed)}

        <div className="space-y-2 border-t border-slate-200 p-3">
          {profile(collapsed)}
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "flex h-8 w-full items-center gap-2 rounded-lg px-2.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900",
              collapsed && "justify-center px-0",
            )}
          >
            {collapsed ? (
              <ChevronsRight className="size-4" />
            ) : (
              <>
                <ChevronsLeft className="size-4" />
                Collapse
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile / tablet drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden print:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={onCloseMobile}
          className={cn(
            "absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-200",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          id="mobile-sidebar"
          className={cn(
            "absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-pop transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
            {brand(false)}
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close navigation"
              tabIndex={mobileOpen ? 0 : -1}
              className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <X className="size-4" />
            </button>
          </div>
          {renderNav(false)}
          <div className="border-t border-slate-200 p-3">{profile(false)}</div>
        </aside>
      </div>
    </>
  );
}
