import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/query/keys";
import { fetchDemoUser } from "@/services/demo/demo.api";

export function useDemoUser(shouldFail: boolean) {
  return useQuery({
    queryKey: queryKeys.demoUser(shouldFail),
    queryFn: () => fetchDemoUser(shouldFail),
  });
}
