"use client";

import { Menu, Search } from "lucide-react";

import AreaSwitcher from "@/components/area/AreaSwitcher";
import Breadcrumbs from "@/components/shell/Breadcrumbs";
import NotificationsMenu from "@/components/shell/NotificationsMenu";
import UserMenu from "@/components/shell/UserMenu";

interface AppTopbarProps {
  mobileNavOpen: boolean;
  onOpenMobileNav: () => void;
  onOpenSearch: () => void;
}

export default function AppTopbar({
  mobileNavOpen,
  onOpenMobileNav,
  onOpenSearch,
}: AppTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-md print:hidden">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-6">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-sidebar"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <div className="min-w-0 flex-1">
          <Breadcrumbs />
        </div>

        {/* Search */}
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search pages and actions"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 md:h-9 md:w-56 md:justify-start md:gap-2 md:border md:border-slate-200 md:bg-slate-50/80 md:px-3 md:hover:bg-white"
        >
          <Search className="size-4 shrink-0" />
          <span className="hidden flex-1 text-left text-sm text-slate-400 md:block">
            Search...
          </span>
          <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 text-[10px] font-medium text-slate-500 md:block">
            Ctrl K
          </kbd>
        </button>

        <div className="hidden max-w-48 shrink-0 sm:block">
          <AreaSwitcher />
        </div>

        <NotificationsMenu />

        <div className="mx-0.5 hidden h-6 w-px bg-slate-200 sm:block" />

        <UserMenu />
      </div>

      {/* Area switcher gets its own row on phones */}
      <div className="border-t border-slate-100 px-3 py-2 sm:hidden">
        <AreaSwitcher />
      </div>
    </header>
  );
}
