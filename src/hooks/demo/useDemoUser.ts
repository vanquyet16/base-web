import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/query/keys";
import { fetchDemoUser } from "@/services/demo/demo.api";
import type { ApiError } from "@/types/api";

export function useDemoUser(shouldFail: boolean) {
  return useQuery({
    queryKey: queryKeys.demo.user(shouldFail),
    queryFn: () => fetchDemoUser(shouldFail),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      const status = (error as ApiError).status;
      if (status && status >= 400 && status < 500) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}
