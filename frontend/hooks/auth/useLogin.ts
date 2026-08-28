import { useMutation, useQueryClient } from "@tanstack/react-query";

import { loginUser } from "@/services/auth.service";

type LoginPayload = Parameters<typeof loginUser>[0];

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginPayload) => loginUser(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });
}
