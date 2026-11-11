"use client";

import { useRouter } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import { ChevronDown, Globe, Info, LayoutDashboard, LogOut } from "lucide-react";

import { useMe } from "@/hooks/auth/useMe";
import { useLogout } from "@/hooks/auth/useLogout";
import { useSelectedArea } from "@/components/area/AreaContext";
import UserAvatar from "@/components/shell/UserAvatar";

const itemClass =
  "flex h-9 cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 text-sm text-slate-700 outline-none data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900 data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:text-slate-400";

export default function UserMenu() {
  const router = useRouter();
  const { data } = useMe();
  const { getAreaAwareHref } = useSelectedArea();
  const { mutateAsync: logout, isPending } = useLogout();

  const user = data?.user;
  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label="Open user menu"
        className="flex items-center gap-2 rounded-lg p-1 pr-1.5 transition hover:bg-slate-100 data-[state=open]:bg-slate-100"
      >
        <UserAvatar name={user.name} />
        <span className="hidden max-w-32 text-left xl:block">
          <span className="block truncate text-sm font-medium leading-tight text-slate-900">
            {user.name}
          </span>
          <span className="block truncate text-[11px] capitalize leading-tight text-slate-500">
            {user.role}
          </span>
        </span>
        <ChevronDown className="hidden size-3.5 text-slate-400 sm:block" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-[60] w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-pop data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div className="flex items-center gap-2.5 px-2.5 py-2">
            <UserAvatar name={user.name} className="size-9" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user.name}
              </p>
              <p className="truncate text-xs text-slate-500">
                @{user.userId} · <span className="capitalize">{user.role}</span>
              </p>
            </div>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />

          <DropdownMenu.Item
            className={itemClass}
            onSelect={() => router.push(getAreaAwareHref("/dashboard"))}
          >
            <LayoutDashboard /> Dashboard
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={itemClass}
            onSelect={() => router.push(getAreaAwareHref("/"))}
          >
            <Globe /> Home page
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={itemClass}
            onSelect={() => router.push(getAreaAwareHref("/about"))}
          >
            <Info /> About
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />

          <DropdownMenu.Item
            className={`${itemClass} text-red-600 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-700 [&_svg]:text-red-500`}
            disabled={isPending}
            onSelect={handleLogout}
          >
            <LogOut /> {isPending ? "Logging out..." : "Log out"}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
