export const coreRoutes = {
  users: {
    me: () => "/users/me",
    byId: (id: string) => `/users/${id}`,
  },
  auth: {
    login: () => "/auth/login",
  },
};
