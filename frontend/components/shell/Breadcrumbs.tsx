"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { useSelectedArea } from "@/components/area/AreaContext";
import { segmentHrefs, segmentLabels } from "@/components/shell/navigation";

// Sections whose `/<section>/<id>` route renders a detail page.
const DETAIL_SECTIONS = new Set(["employees", "users", "payroll", "attendance"]);

type Crumb = { label: string; href?: string };

function buildCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);

  // Role dashboards (/dashboard/admin etc.) are all just "Dashboard".
  if (segments[0] === "dashboard") {
    return segments[1] === "unauthorized"
      ? [{ label: "Dashboard", href: "/dashboard" }, { label: "Unauthorized" }]
      : [{ label: "Dashboard" }];
  }

  const crumbs: Crumb[] = [];
  let path = "";

  segments.forEach((segment, index) => {
    path += `/${segment}`;

    if (segment === "view") return;

    const known = segmentLabels[segment];
    const isLast =
      index === segments.length - 1 ||
      (index === segments.length - 2 && segments[index + 1] === "view");

    if (known) {
      const href = index === 0 ? (segmentHrefs[segment] ?? path) : path;
      crumbs.push({ label: known, href: isLast ? undefined : href });
      return;
    }

    // Dynamic id segment
    const section = segments[0];
    crumbs.push({
      label: "Details",
      href: !isLast && DETAIL_SECTIONS.has(section) ? path : undefined,
    });
  });

  return crumbs;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const { getAreaAwareHref } = useSelectedArea();
  const crumbs = buildCrumbs(pathname);

  if (!crumbs.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1 text-sm">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li
              key={`${crumb.label}-${index}`}
              className={
                isLast
                  ? "flex min-w-0 items-center gap-1"
                  : "hidden min-w-0 items-center gap-1 md:flex"
              }
            >
              {index > 0 && (
                <ChevronRight className="hidden size-3.5 shrink-0 text-slate-300 md:block" />
              )}
              {crumb.href && !isLast ? (
                <Link
                  href={getAreaAwareHref(crumb.href)}
                  className="truncate text-slate-500 transition hover:text-slate-900"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="truncate font-medium text-slate-900"
                >
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
