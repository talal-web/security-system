import { useMutation, useQueryClient } from "@tanstack/react-query";

import { LoginPayload } from "@/types/user";

import { loginUser } from "@/services/auth.service";

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
