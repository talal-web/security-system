import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logoutUser } from "@/services/auth.service";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: async () => {
      queryClient.setQueryData(["me"], null);
      await queryClient.cancelQueries({ queryKey: ["me"] });
    },
  });
}
