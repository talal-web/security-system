"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

import { useAreas } from "@/hooks/area/useArea";
import { useMe } from "@/hooks/auth/useMe";
import type { Area } from "@/types/area";

const STORAGE_KEY = "security-app:selected-area";

interface AreaContextValue {
  availableAreas: Area[];
  selectedAreaId: string | null;
  selectedArea: Area | null;
  setSelectedAreaId: (areaId: string | null) => void;
  getAreaAwareHref: (path: string) => string;
}

const AreaContext = createContext<AreaContextValue | null>(null);

function buildAreaAwareUrl(path: string, areaId: string | null) {
  if (!path) return path;

  if (!areaId) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const [pathname, search = ""] = cleanPath.split("?");
  const params = new URLSearchParams(search);
  params.set("area", areaId);

  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function AreaProvider({ children }: { children: ReactNode }) {
  const { data: meData } = useMe();
  const searchParams = useSearchParams();
  const { data: allAreas = [] } = useAreas({ isActive: true });

  const userRole = meData?.user?.role;
  const userAreaIds = meData?.user?.areas ?? [];

  const availableAreas = useMemo(() => {
    if (!allAreas.length) return [];

    if (userRole === "admin" || userRole === "developer") {
      return allAreas;
    }

    return allAreas.filter((area) => userAreaIds.includes(area._id));
  }, [allAreas, userAreaIds, userRole]);

  const [selectedAreaId, setSelectedAreaIdState] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!availableAreas.length) {
      setSelectedAreaIdState(null);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      return;
    }

    const routeAreaId = searchParams.get("area");
    const storedAreaId =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;

    const preferredAreaId =
      routeAreaId && availableAreas.some((area) => area._id === routeAreaId)
        ? routeAreaId
        : storedAreaId &&
            availableAreas.some((area) => area._id === storedAreaId)
          ? storedAreaId
          : availableAreas[0]._id;

    setSelectedAreaIdState(preferredAreaId);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, preferredAreaId);
    }
  }, [availableAreas, searchParams]);

  const setSelectedAreaId = (areaId: string | null) => {
    setSelectedAreaIdState(areaId);

    if (typeof window !== "undefined") {
      if (areaId) {
        window.localStorage.setItem(STORAGE_KEY, areaId);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const selectedArea =
    availableAreas.find((area) => area._id === selectedAreaId) ?? null;

  const value = useMemo<AreaContextValue>(
    () => ({
      availableAreas,
      selectedAreaId,
      selectedArea,
      setSelectedAreaId,
      getAreaAwareHref: (path) => buildAreaAwareUrl(path, selectedAreaId),
    }),
    [availableAreas, selectedArea, selectedAreaId],
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
