"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import Image from "next/image";

import { useLogout } from "@/hooks/auth/useLogout";
import { useMe } from "@/hooks/auth/useMe";
import AreaSwitcher from "@/components/area/AreaSwitcher";
import { useSelectedArea } from "@/components/area/AreaContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const { data } = useMe();
  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();

  const { getAreaAwareHref } = useSelectedArea();

  const user = data?.user;

  const closeMenu = () => setOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const dashboardClass =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-linear-to-r from-blue-600 via-sky-500 to-red-500 px-3 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200/40 transition hover:-translate-y-0.5 hover:brightness-110";

  const linkClass = (href: string) =>
    `rounded-xl px-3 py-2.5 text-sm font-medium transition ${
      isActive(href)
        ? "bg-blue-50 text-blue-700"
        : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/95 shadow-sm shadow-slate-200/40 backdrop-blur-xl print:hidden">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:min-h-20 sm:gap-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href={getAreaAwareHref("/")}
          onClick={closeMenu}
          className="group flex min-w-0 shrink-0 items-center gap-2 sm:gap-3"
        >
          <div className="relative h-10 w-10 shrink-0 transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12">
            <Image
              src="/images/logo.png"
              alt="Baidar Security Logo"
              fill
              priority
              sizes="48px"
              className="rounded-xl object-contain"
            />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
              Baidar Security
            </h2>
            <p className="hidden text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 sm:block sm:text-[11px] sm:tracking-[0.2em]">
              Workforce Management
            </p>
          </div>
        </Link>

        {/* Full navigation: laptop and desktop */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={getAreaAwareHref(link.href)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition ${
                isActive(link.href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Full actions: laptop and desktop */}
        <div className="hidden shrink-0 items-center gap-1 lg:flex">
          {user ? (
            <>
              <div className="max-w-44">
                <AreaSwitcher />
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium text-slate-700 transition hover:text-red-600 disabled:opacity-50"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <Link
              href="/?login=true"
              className="whitespace-nowrap px-2 py-2 text-sm font-medium text-slate-700 hover:text-blue-700"
            >
              Login
            </Link>
          )}

          <Link
            href={getAreaAwareHref("/dashboard")}
            className={dashboardClass}
          >
            Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Compact actions: tablet and small laptop */}
        <div className="hidden shrink-0 items-center gap-2 md:flex lg:hidden">
          {user && (
            <div className="max-w-40">
              <AreaSwitcher />
            </div>
          )}

          <Link
            href={getAreaAwareHref("/dashboard")}
            className="whitespace-nowrap rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white"
          >
            Dashboard
          </Link>
        </div>

        {/* Hamburger: below lg */}
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Collapsible navigation: below lg */}
      {open && (
        <div
          id="mobile-navigation"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-slate-200/70 bg-white/95 shadow-lg backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-3 py-4 sm:px-6 lg:px-8">
            {user && (
              <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Active Area
                </p>
                <AreaSwitcher />
              </div>
            )}

            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={getAreaAwareHref(link.href)}
                  onClick={closeMenu}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={linkClass(link.href)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-200 pt-4 sm:grid-cols-2">
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              ) : (
                <Link
                  href="/?login=true"
                  onClick={closeMenu}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Login
                </Link>
              )}

              <Link
                href={getAreaAwareHref("/dashboard")}
                onClick={closeMenu}
                className={`${dashboardClass} w-full`}
              >
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
