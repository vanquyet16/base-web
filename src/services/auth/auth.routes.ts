import { buildPath } from "@/services/routes";

export const authRoutes = {
  login: () => "/auth/login",
  refresh: () => "/auth/refresh",
  logout: () => "/auth/logout",
  session: () => "/auth/session",
  verifyEmail: (token: string) => buildPath("/auth/verify/:token", { token }),
};
