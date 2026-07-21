import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logoutUser } from "@/services/auth.service";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
