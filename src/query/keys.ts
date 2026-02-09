import type { ListParams } from "@/types/api";

export const queryKeys = {
  demo: {
    all: ["demo"] as const,
    users: () => [...queryKeys.demo.all, "users"] as const,
    user: (shouldFail: boolean) =>
      [...queryKeys.demo.users(), shouldFail] as const,
  },
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters?: ListParams) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
    permissions: () => [...queryKeys.auth.all, "permissions"] as const,
  },
} as const;
