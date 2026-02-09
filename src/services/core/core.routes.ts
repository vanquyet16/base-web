import { buildPath, withQuery } from "@/services/routes";

type UserListQuery = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export const coreRoutes = {
  users: {
    me: () => "/users/me",
    list: (query?: UserListQuery) => withQuery("/users", query),
    byId: (id: string) => buildPath("/users/:id", { id }),
  },
  auth: {
    login: () => "/auth/login",
  },
};
