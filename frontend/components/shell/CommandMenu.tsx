"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { CornerDownLeft, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { useMe } from "@/hooks/auth/useMe";
import { useSelectedArea } from "@/components/area/AreaContext";
import {
  getNavGroupsForRole,
  quickActions,
  type NavItem,
} from "@/components/shell/navigation";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Entry = NavItem & { group: string };

export default function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter();
  const { data } = useMe();
  const { getAreaAwareHref } = useSelectedArea();
  const role = data?.user?.role;

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const entries = useMemo<Entry[]>(() => {
    if (!role) return [];

    const pages = getNavGroupsForRole(role).flatMap((group) =>
      group.items.map((item) => ({ ...item, group: group.label })),
    );
    const actions = quickActions
      .filter((item) => item.roles.includes(role))
      .map((item) => ({ ...item, group: "Quick actions" }));

    return [...actions, ...pages];
  }, [role]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;

    return entries.filter((entry) =>
      `${entry.label} ${entry.group} ${entry.keywords ?? ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [entries, query]);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setQuery("");
      setActiveIndex(0);
    }
    onOpenChange(next);
  };

  const go = (entry: Entry) => {
    handleOpenChange(false);
    router.push(getAreaAwareHref(entry.href));
  };

  // Keep the highlighted row in view while navigating with arrows.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      go(results[activeIndex]);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          onKeyDown={onKeyDown}
          className="fixed left-1/2 top-[12vh] z-[61] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <Dialog.Title className="sr-only">Search pages and actions</Dialog.Title>
          <Dialog.Description className="sr-only">
            Type to filter, use arrow keys to move and Enter to open.
          </Dialog.Description>

          <div className="flex items-center gap-2.5 border-b border-slate-200 px-4">
            <Search className="size-4 shrink-0 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              placeholder="Search pages and actions..."
              aria-label="Search pages and actions"
              className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 sm:block">
              ESC
            </kbd>
          </div>

          <ul ref={listRef} role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
            {results.length === 0 && (
              <li className="px-3 py-10 text-center text-sm text-slate-500">
                No results for &ldquo;{query}&rdquo;
              </li>
            )}

            {results.map((entry, index) => {
              const showGroup = results[index - 1]?.group !== entry.group;
              const Icon = entry.icon;
              const active = index === activeIndex;

              return (
                <li key={`${entry.group}-${entry.href}`}>
                  {showGroup && (
                    <p className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {entry.group}
                    </p>
                  )}
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    data-index={index}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={() => go(entry)}
                    className={cn(
                      "flex h-10 w-full items-center gap-3 rounded-lg px-2.5 text-left text-sm transition-colors",
                      active ? "bg-slate-100 text-slate-900" : "text-slate-600",
                    )}
                  >
                    <Icon className="size-4 shrink-0 text-slate-400" />
                    <span className="flex-1 truncate">{entry.label}</span>
                    {active && (
                      <CornerDownLeft className="size-3.5 shrink-0 text-slate-400" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
