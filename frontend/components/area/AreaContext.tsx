"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAreas } from "@/hooks/area/useArea";
import { useMe } from "@/hooks/auth/useMe";
import type { Area } from "@/types/area";

const STORAGE_KEY = "security-app:selected-area";

interface AreaContextValue {
  availableAreas: Area[];
  selectedAreaId: string | null;
  selectedArea: Area | null;
  isAreaLoading: boolean;
  setSelectedAreaId: (areaId: string | null) => void;
  getAreaAwareHref: (path: string) => string;
}

const AreaContext = createContext<AreaContextValue | null>(null);

// ======================================
// Safe localStorage helpers
// ======================================

// localStorage doesn't exist during server rendering, and can be
// blocked in the browser (private mode, settings), so every access
// is guarded.
const getStoredAreaId = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const setStoredAreaId = (areaId: string | null) => {
  if (typeof window === "undefined") return;

  try {
    if (areaId) {
      localStorage.setItem(STORAGE_KEY, areaId);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore: the selection still works through the URL.
  }
};

function buildAreaAwareUrl(path: string, areaId: string | null) {
  if (!path) return path;

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const [pathAndQuery, hash = ""] = cleanPath.split("#");
  const [pathname, search = ""] = pathAndQuery.split("?");

  const params = new URLSearchParams(search);

  if (areaId) {
    params.set("area", areaId);
  } else {
    params.delete("area");
  }

  const query = params.toString();

  return `${pathname}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

export function AreaProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: meData, isPending: isMePending, isError: isMeError } = useMe();

  const {
    data: allAreas = [],
    isPending: isAreasPending,
    isError: isAreasError,
  } = useAreas({ isActive: true });

  const user = meData?.user;
  const userRole = user?.role;
  const userAreaIds = user?.areas ?? [];

  const userAreaKey = userAreaIds.map(String).sort().join(",");

  const availableAreas = useMemo(() => {
    if (!user) return [];

    if (userRole === "admin" || userRole === "developer") {
      return allAreas;
    }

    const assignedIds = new Set(userAreaKey.split(",").filter(Boolean));

    return allAreas.filter((area) => assignedIds.has(String(area._id)));
  }, [allAreas, user, userRole, userAreaKey]);

  const routeAreaId = searchParams.get("area");

  const isAllowed = useCallback(
    (id: string | null) =>
      !!id && availableAreas.some((area) => String(area._id) === id),
    [availableAreas],
  );

  // Only read storage once areas are loaded, so it's always checked
  // against a real list (and never during server rendering).
  const storedAreaId = availableAreas.length ? getStoredAreaId() : null;

  // Selection order:
  // 1. URL ?area=, if the user may use it
  // 2. Last-used area from localStorage, if still allowed
  // 3. First available area
  const selectedAreaId = isAllowed(routeAreaId)
    ? routeAreaId
    : isAllowed(storedAreaId)
      ? storedAreaId
      : availableAreas.length
        ? String(availableAreas[0]._id)
        : null;

  const selectedArea =
    availableAreas.find((area) => String(area._id) === selectedAreaId) ?? null;

  const isAreaLoading = isMePending || (!isMeError && isAreasPending);

  // Keep the browser's stored selection synchronized.
  useEffect(() => {
    if (isAreaLoading || isAreasError || isMeError) return;

    if (!user || !selectedAreaId) {
      setStoredAreaId(null);
      return;
    }

    setStoredAreaId(selectedAreaId);
  }, [isAreaLoading, isAreasError, isMeError, user, selectedAreaId]);

  // Correct missing or invalid URL selections.
  useEffect(() => {
    if (isAreaLoading || isAreasError || isMeError || !user) {
      return;
    }

    if (routeAreaId === selectedAreaId) return;

    const currentQuery = searchParams.toString();
    const currentPath = currentQuery ? `${pathname}?${currentQuery}` : pathname;

    router.replace(buildAreaAwareUrl(currentPath, selectedAreaId), {
      scroll: false,
    });
  }, [
    isAreaLoading,
    isAreasError,
    isMeError,
    user,
    routeAreaId,
    selectedAreaId,
    pathname,
    router,
    searchParams,
  ]);

  const setSelectedAreaId = useCallback(
    (areaId: string | null) => {
      if (areaId !== null && !isAllowed(areaId)) {
        console.warn("Selected area is not available to this user.");
        return;
      }

      // Update storage right away so passing null ("reset") doesn't
      // snap back to the previously stored area.
      setStoredAreaId(areaId);

      const currentQuery = searchParams.toString();
      const currentPath = currentQuery
        ? `${pathname}?${currentQuery}`
        : pathname;

      router.replace(buildAreaAwareUrl(currentPath, areaId), { scroll: false });
    },
    [isAllowed, pathname, router, searchParams],
  );

  const getAreaAwareHref = useCallback(
    (path: string) => buildAreaAwareUrl(path, selectedAreaId),
    [selectedAreaId],
  );

  const value = useMemo<AreaContextValue>(
    () => ({
      availableAreas,
      selectedAreaId,
      selectedArea,
      isAreaLoading,
      setSelectedAreaId,
      getAreaAwareHref,
    }),
    [
      availableAreas,
      selectedAreaId,
      selectedArea,
      isAreaLoading,
      setSelectedAreaId,
      getAreaAwareHref,
    ],
  );

  return <AreaContext.Provider value={value}>{children}</AreaContext.Provider>;
}

export function useSelectedArea() {
  const context = useContext(AreaContext);

  if (!context) {
    throw new Error("useSelectedArea must be used within an AreaProvider");
  }

  return context;
}
