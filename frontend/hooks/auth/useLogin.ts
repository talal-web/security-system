import { useMutation } from "@tanstack/react-query";
import { LoginPayload } from "@/types/user";

import { loginUser } from "@/services/authService";

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginPayload) => loginUser(data),
  });
}
