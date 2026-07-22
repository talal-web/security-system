import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/services/auth.service";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // Keep cache for 10 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: false,
  });
};
