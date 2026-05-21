// hooks/auth/useMe.ts

import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/services/auth.service";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
