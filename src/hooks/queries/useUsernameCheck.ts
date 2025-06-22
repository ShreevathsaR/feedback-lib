import { usernameCheck } from "@/services/usernameCheck";
import { useQuery } from "@tanstack/react-query";

export const useUsernameCheck = (username: string) => {
  return useQuery({
    queryKey: ["username-check", username],
    queryFn: () => usernameCheck(username),
    enabled: !!username,
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: false
  });
};
